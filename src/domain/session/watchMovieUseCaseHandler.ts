import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { WatchHistory } from '../user/entity/watchHistory';
import { UserService } from '../user/service/userService';
import { SessionExpiredError } from './error/sessionExpiredError';
import { SessionNotFoundError } from './error/sessionNotFoundError';
import { SessionNotStartedError } from './error/sessionNotStartedError';
import { TicketAlreadyUsedError } from './error/ticketAlreadyUsedError';
import { TicketNotFoundError } from './error/ticketNotFoundError';
import { TicketUserMismatchError } from './error/ticketUserMismatchError';
import { SessionPort } from './port/sessionPort';
import { WatchMovieUseCase } from './useCase/watchMovieUseCase';

@injectable()
export class WatchMovieUseCaseHandler implements UseCaseHandler<WatchMovieUseCase, void> {
  constructor(
    @inject(InjectionToken.SessionPort)
    private readonly sessionPort: SessionPort,
    @inject(InjectionToken.UserService)
    private readonly userService: UserService,
  ) {}

  async handle({ actor, ticketId }: WatchMovieUseCase): Promise<void> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    const ticket = await this.sessionPort.findTicketById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }

    if (ticket.isUsed) {
      throw new TicketAlreadyUsedError(ticketId);
    }

    if (ticket.userId !== actor.id) {
      throw new TicketUserMismatchError(ticketId);
    }

    const session = await this.sessionPort.findSessionById(ticket.sessionId);
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

    await this.sessionPort.markTicketAsUsed(ticketId);

    // we also could create a domain event here
    const watchHistory = WatchHistory.create({
      userId: actor.id,
      movieId: session.movieId,
    });
    await this.userService.createWatchHistory(watchHistory);
  }
}
