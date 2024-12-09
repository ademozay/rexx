import { Actor } from '../../shared/actor';

export class RegisterManagerUseCase {
  constructor(
    readonly actor: Actor,
    readonly email: string,
    readonly password: string,
    readonly age: number,
  ) {}
}
