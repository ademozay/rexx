import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { Session } from './entity/session';
import { OnlyManagersCanUpdateSessionError } from './error/onlyManagersCanUpdateSessionError';
import { SessionAlreadyStartedError } from './error/sessionAlreadyStartedError';
import { SessionNotFoundError } from './error/sessionNotFoundError';
import { SessionPort } from './port/sessionPort';
import { UpdateSessionUseCase } from './useCase/updateSessionUseCase';

@injectable()
export class UpdateSessionUseCaseHandler implements UseCaseHandler<UpdateSessionUseCase, Session> {
  constructor(
    @inject(InjectionToken.SessionPort)
    private readonly sessionPort: SessionPort,
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

    const existingSession = await this.sessionPort.findSessionById(sessionId);
    if (!existingSession) {
      throw new SessionNotFoundError(sessionId);
    }

    if (existingSession.hasStarted) {
      throw new SessionAlreadyStartedError(sessionId);
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
    return this.sessionPort.updateSession(session);
  }
}
