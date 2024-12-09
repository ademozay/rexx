import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { User } from './entity/user';
import { UserRole } from './entity/userRole';
import { OnlyManagersCanRegisterManagerError } from './error/onlyManagersCanRegisterManagerError';
import { UserAlreadyRegisteredError } from './error/userAlreadyRegisteredError';
import { UserPort } from './port/userPort';
import { RegisterManagerUseCase } from './useCase/registerManagerUseCase';

@injectable()
export class RegisterManagerUseCaseHandler implements UseCaseHandler<RegisterManagerUseCase, void> {
  constructor(
    @inject(InjectionToken.UserPort)
    private readonly userPort: UserPort,
  ) {}

  async handle({ actor, email, password, age }: RegisterManagerUseCase): Promise<void> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    if (!actor.isManager) {
      throw new OnlyManagersCanRegisterManagerError();
    }

    const existingUser = await this.userPort.findUserByEmail(email);
    if (existingUser) {
      throw new UserAlreadyRegisteredError(email);
    }

    const user = User.create({ email, password, age, role: UserRole.MANAGER });
    await this.userPort.createUser(user);
  }
}
