import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { User } from './entity/user';
import { UserRole } from './entity/userRole';
import { UserAlreadyRegisteredError } from './error/userAlreadyRegisteredError';
import { UserPort } from './port/userPort';
import { RegisterCustomerUseCase } from './useCase/registerCustomerUseCase';

@injectable()
export class RegisterCustomerUseCaseHandler
  implements UseCaseHandler<RegisterCustomerUseCase, void>
{
  constructor(
    @inject(InjectionToken.UserPort)
    private readonly userPort: UserPort,
  ) {}

  async handle({ email, password, age }: RegisterCustomerUseCase): Promise<void> {
    const existingUser = await this.userPort.findUserByEmail(email);
    if (existingUser) {
      throw new UserAlreadyRegisteredError(email);
    }

    const user = User.create({ email, password, age, role: UserRole.CUSTOMER });

    await this.userPort.createUser(user);
  }
}
