import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { Session } from './entity/session';
import { MovieNotFoundError } from './error/movie/movieNotFoundError';
import { OnlyManagersCanUpdateSessionError } from './error/session/onlyManagersCanUpdateSessionError';
import { SessionAlreadyStartedError } from './error/session/sessionAlreadyStartedError';
import { SessionDateCannotBeInPastError } from './error/session/sessionDateCannotBeInPastError';
import { SessionExpiredError } from './error/session/sessionExpiredError';
import { SessionNotFoundError } from './error/session/sessionNotFoundError';
import { MoviePort } from './port/moviePort';
import { UpdateSessionUseCase } from './useCase/updateSessionUseCase';

@injectable()
export class UpdateSessionUseCaseHandler implements UseCaseHandler<UpdateSessionUseCase, Session> {
  constructor(
    @inject(InjectionToken.MoviePort)
    private readonly moviePort: MoviePort,
  ) {}

  async handle({
    actor,
    sessionId,
    movieId,
    sessionDate,
    timeSlotLabel,
    roomNumber,
  }: UpdateSessionUseCase): Promise<Session> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    if (!actor.isManager) {
      throw new OnlyManagersCanUpdateSessionError();
    }

    const existingSession = await this.moviePort.findSessionById(sessionId);
    if (!existingSession) {
      throw new SessionNotFoundError(sessionId);
    }

    if (existingSession.hasFinished) {
      throw new SessionExpiredError(sessionId);
    }

    if (existingSession.hasStarted) {
      throw new SessionAlreadyStartedError(sessionId);
    }

    const movie = await this.moviePort.findMovieById(movieId);
    if (!movie) {
      throw new MovieNotFoundError(movieId);
    }

    const session = Session.update(
      {
        movieId,
        sessionDate,
        timeSlotLabel,
        roomNumber,
      },
      sessionId,
    );

    if (session.hasStarted) {
      throw new SessionDateCannotBeInPastError(session.sessionDate);
    }

    return this.moviePort.updateSession(session);
  }
}
