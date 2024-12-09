import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { Session } from './entity/session';
import { SessionPort } from './port/sessionPort';
import { FindMovieSessionsUseCase } from './useCase/findMovieSessions';

@injectable()
export class FindMovieSessionsUseCaseHandler
  implements UseCaseHandler<FindMovieSessionsUseCase, Session[]>
{
  constructor(
    @inject(InjectionToken.SessionPort)
    private readonly sessionPort: SessionPort,
  ) {}

  async handle({ actor, movieIds }: FindMovieSessionsUseCase): Promise<Session[]> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    return this.sessionPort.findSessionsByMovieIds(movieIds);
  }
}
