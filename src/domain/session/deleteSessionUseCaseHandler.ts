import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { OnlyManagersCanDeleteSessionError } from './error/onlyManagersCanDeleteSessionError';
import { SessionAlreadyStartedError } from './error/sessionAlreadyStartedError';
import { SessionNotFoundError } from './error/sessionNotFoundError';
import { SessionPort } from './port/sessionPort';
import { DeleteSessionUseCase } from './useCase/deleteSessionUseCase';

@injectable()
export class DeleteSessionUseCaseHandler implements UseCaseHandler<DeleteSessionUseCase, void> {
  constructor(
    @inject(InjectionToken.SessionPort)
    private readonly sessionPort: SessionPort,
  ) {}

  async handle({ actor, sessionId }: DeleteSessionUseCase): Promise<void> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    if (!actor.isManager) {
      throw new OnlyManagersCanDeleteSessionError();
    }

    const existingSession = await this.sessionPort.findSessionById(sessionId);
    if (!existingSession) {
      throw new SessionNotFoundError(sessionId);
    }

    if (existingSession.hasStarted) {
      throw new SessionAlreadyStartedError(sessionId);
    }

    await this.sessionPort.deleteSession(sessionId);
  }
}
