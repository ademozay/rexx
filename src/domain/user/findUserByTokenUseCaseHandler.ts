import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { Actor } from '../shared/actor';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { UserPort } from './port/userPort';
import { FindUserByTokenUseCase } from './useCase/findUserByTokenUseCase';

@injectable()
export class FindActorByTokenUseCaseHandler
  implements UseCaseHandler<FindUserByTokenUseCase, Actor | undefined>
{
  constructor(
    @inject(InjectionToken.UserPort)
    private readonly userPort: UserPort,
  ) {}

  async handle({ token }: FindUserByTokenUseCase): Promise<Actor | undefined> {
    return this.userPort.findActorByToken(token);
  }
}
