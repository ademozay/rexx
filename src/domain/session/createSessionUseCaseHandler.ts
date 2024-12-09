import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { Session } from './entity/session';
import { OnlyManagersCanCreateSessionError } from './error/onlyManagersCanCreateSessionError';
import { SessionAlreadyExistsError } from './error/sessionAlreadyExistsError';
import { SessionDateCannotBeInPastError } from './error/sessionDateCannotBeInPastError';
import { SessionPort } from './port/sessionPort';
import { CreateSessionUseCase } from './useCase/createSessionUseCase';

@injectable()
export class CreateSessionUseCaseHandler implements UseCaseHandler<CreateSessionUseCase, Session> {
  constructor(
    @inject(InjectionToken.SessionPort)
    private readonly sessionPort: SessionPort,
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

    const sessionExists = await this.sessionPort.sessionExists(session);
    if (sessionExists) {
      throw new SessionAlreadyExistsError(movieId, roomNumber, sessionDate, timeSlotLabel);
    }

    if (session.hasStarted) {
      throw new SessionDateCannotBeInPastError(session.sessionDate);
    }

    return this.sessionPort.createSession(session);
  }
}
