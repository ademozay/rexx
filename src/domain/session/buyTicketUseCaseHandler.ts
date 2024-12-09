import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { MovieService } from '../movie/service/movieService';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { UserService } from '../user/service/userService';
import { Ticket } from './entity/ticket';
import { SessionAlreadyStartedError } from './error/sessionAlreadyStartedError';
import { SessionExpiredError } from './error/sessionExpiredError';
import { SessionNotFoundError } from './error/sessionNotFoundError';
import { TicketAlreadySoldError } from './error/ticketAlreadySoldError';
import { UserTooYoungError } from './error/userTooYoungError';
import { SessionPort } from './port/sessionPort';
import { BuyTicketUseCase } from './useCase/buyTicketUseCase';

@injectable()
export class BuyTicketUseCaseHandler implements UseCaseHandler<BuyTicketUseCase, Ticket> {
  constructor(
    @inject(InjectionToken.SessionPort)
    private readonly sessionPort: SessionPort,
    @inject(InjectionToken.MovieService)
    private readonly movieService: MovieService,
    @inject(InjectionToken.UserService)
    private readonly userService: UserService,
  ) {}

  async handle({ actor, sessionId }: BuyTicketUseCase): Promise<Ticket> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    const existingTicket = await this.sessionPort.findTicketBySessionId(sessionId);
    if (existingTicket) {
      throw new TicketAlreadySoldError(existingTicket.id);
    }

    const session = await this.sessionPort.findSessionById(sessionId);
    if (!session) {
      throw new SessionNotFoundError(sessionId);
    }

    if (session.hasStarted) {
      throw new SessionAlreadyStartedError(sessionId);
    }

    if (session.hasFinished) {
      throw new SessionExpiredError(sessionId);
    }

    // I moved error handling to the service layer
    // to avoid coupling between movie domain and session domain
    // because I thought session domain should not throw a domain error from movie domain.
    // I also think that it's good for DX to see all thrown domain errors in one place.
    const [movie, userAge] = await Promise.all([
      this.movieService.findMovieById(session.movieId),
      this.userService.getUserAge(actor.id),
    ]);

    if (movie.isRestrictedForAge(userAge)) {
      throw new UserTooYoungError(actor.id, movie.ageRestriction);
    }

    const ticket = session.createTicket(actor.id);
    return this.sessionPort.createTicket(ticket);
  }
}
