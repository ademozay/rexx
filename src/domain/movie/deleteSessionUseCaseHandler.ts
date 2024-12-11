import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { OnlyManagersCanDeleteSessionError } from './error/session/onlyManagersCanDeleteSessionError';
import { SessionAlreadyStartedError } from './error/session/sessionAlreadyStartedError';
import { SessionNotFoundError } from './error/session/sessionNotFoundError';
import { MoviePort } from './port/moviePort';
import { DeleteSessionUseCase } from './useCase/deleteSessionUseCase';

@injectable()
export class DeleteSessionUseCaseHandler implements UseCaseHandler<DeleteSessionUseCase, void> {
  constructor(
    @inject(InjectionToken.MoviePort)
    private readonly moviePort: MoviePort,
  ) {}

  async handle({ actor, sessionId }: DeleteSessionUseCase): Promise<void> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    if (!actor.isManager) {
      throw new OnlyManagersCanDeleteSessionError();
    }

    const existingSession = await this.moviePort.findSessionById(sessionId);
    if (!existingSession) {
      throw new SessionNotFoundError(sessionId);
    }

    if (existingSession.hasStarted) {
      throw new SessionAlreadyStartedError(sessionId);
    }

    await this.moviePort.deleteSession(sessionId);
  }
}
