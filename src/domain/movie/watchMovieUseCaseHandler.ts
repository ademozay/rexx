import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { TicketAlreadyUsedError } from '../ticket/error/ticketAlreadyUsedError';
import { TicketNotFoundError } from '../ticket/error/ticketNotFoundError';
import { TicketUserMismatchError } from '../ticket/error/ticketUserMismatchError';
import { TicketService } from '../ticket/service/ticketService';
import { WatchHistory } from '../user/entity/watchHistory';
import { UserService } from '../user/service/userService';
import { SessionExpiredError } from './error/session/sessionExpiredError';
import { SessionNotFoundError } from './error/session/sessionNotFoundError';
import { SessionNotStartedError } from './error/session/sessionNotStartedError';
import { MoviePort } from './port/moviePort';
import { WatchMovieUseCase } from './useCase/watchMovieUseCase';

@injectable()
export class WatchMovieUseCaseHandler implements UseCaseHandler<WatchMovieUseCase, void> {
  constructor(
    @inject(InjectionToken.MoviePort)
    private readonly moviePort: MoviePort,
    @inject(InjectionToken.UserService)
    private readonly userService: UserService,
    @inject(InjectionToken.TicketService)
    private readonly ticketService: TicketService,
  ) {}

  async handle({ actor, ticketId }: WatchMovieUseCase): Promise<void> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    const ticket = await this.ticketService.findTicketById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }

    if (ticket.used) {
      throw new TicketAlreadyUsedError(ticketId);
    }

    if (ticket.userId !== actor.id) {
      throw new TicketUserMismatchError(ticketId);
    }

    const session = await this.moviePort.findSessionById(ticket.sessionId);
    if (!session) {
      throw new SessionNotFoundError(ticket.sessionId);
    }

    if (!session.hasStarted) {
      throw new SessionNotStartedError(session.id);
    }

    if (session.hasFinished) {
      throw new SessionExpiredError(session.id);
    }

    // TODO: could not decide how to mock here, tbh
    ticket.markAsUsed();

    await this.ticketService.updateTicket(ticket);

    // we also could create a domain event here
    const watchHistory = WatchHistory.create({
      userId: actor.id,
      movieId: session.movieId,
    });
    await this.userService.createWatchHistory(watchHistory);
  }
}
