import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { SessionAlreadyStartedError } from '../movie/error/session/sessionAlreadyStartedError';
import { SessionExpiredError } from '../movie/error/session/sessionExpiredError';
import { SessionNotFoundError } from '../movie/error/session/sessionNotFoundError';
import { MovieService } from '../movie/service/movieService';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { UserService } from '../user/service/userService';
import { TicketAlreadySoldError } from './error/ticketAlreadySoldError';
import { UserTooYoungError } from './error/userTooYoungError';
import { TicketPort } from './port/ticketPort';
import { BuyTicketUseCaseInput, BuyTicketUseCaseOutput } from './useCase/buyTicketUseCase';

@injectable()
export class BuyTicketUseCaseHandler
  implements UseCaseHandler<BuyTicketUseCaseInput, BuyTicketUseCaseOutput>
{
  constructor(
    @inject(InjectionToken.TicketPort)
    private readonly ticketPort: TicketPort,
    @inject(InjectionToken.MovieService)
    private readonly movieService: MovieService,
    @inject(InjectionToken.UserService)
    private readonly userService: UserService,
  ) {}

  async handle({ actor, sessionId }: BuyTicketUseCaseInput): Promise<BuyTicketUseCaseOutput> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    const existingTicket = await this.ticketPort.findTicketBySessionId(sessionId);
    if (existingTicket) {
      throw new TicketAlreadySoldError(existingTicket.id);
    }

    const session = await this.movieService.findSessionById(sessionId);
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
    const createdTicket = await this.ticketPort.createTicket(ticket);

    return { ticket: { id: createdTicket.id } };
  }
}
