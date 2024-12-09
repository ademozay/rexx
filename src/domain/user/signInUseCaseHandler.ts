import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { Actor } from '../shared/actor';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { InvalidCredentialsError } from './error/invalidCredentialsError';
import { UserPort } from './port/userPort';
import { SignInUseCase } from './useCase/signInUseCase';

@injectable()
export class SignInUseCaseHandler implements UseCaseHandler<SignInUseCase, { token: string }> {
  constructor(
    @inject(InjectionToken.UserPort)
    private readonly userPort: UserPort,
  ) {}

  async handle({ email, password }: SignInUseCase): Promise<{ token: string }> {
    const user = await this.userPort.findUserByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordCorrect = await this.userPort.comparePassword(password, user.password.value);
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError();
    }

    const actor = Actor.create({
      id: user.id,
      role: user.role,
    });

    return this.userPort.createActor(actor);
  }
}
