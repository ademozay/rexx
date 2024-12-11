import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { Session } from './entity/session';
import { OnlyManagersCanCreateSessionError } from './error/session/onlyManagersCanCreateSessionError';
import { SessionAlreadyExistsError } from './error/session/sessionAlreadyExistsError';
import { SessionDateCannotBeInPastError } from './error/session/sessionDateCannotBeInPastError';
import { MoviePort } from './port/moviePort';
import { CreateSessionUseCase } from './useCase/createSessionUseCase';

@injectable()
export class CreateSessionUseCaseHandler implements UseCaseHandler<CreateSessionUseCase, Session> {
  constructor(
    @inject(InjectionToken.MoviePort)
    private readonly moviePort: MoviePort,
  ) {}

  async handle({
    actor,
    movieId,
    sessionDate,
    timeSlotLabel,
    roomNumber,
  }: CreateSessionUseCase): Promise<Session> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    if (!actor.isManager) {
      throw new OnlyManagersCanCreateSessionError();
    }

    const session = Session.create({
      movieId,
      sessionDate,
      timeSlotLabel,
      roomNumber,
    });

    const sessionExists = await this.moviePort.sessionExists(session);
    if (sessionExists) {
      throw new SessionAlreadyExistsError(movieId, roomNumber, sessionDate, timeSlotLabel);
    }

    if (session.hasStarted) {
      throw new SessionDateCannotBeInPastError(session.sessionDate);
    }

    return this.moviePort.createSession(session);
  }
}
