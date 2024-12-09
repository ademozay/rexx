import { ValueObject } from '../../shared/valueObject';
import { InvalidPasswordError } from '../error/invalidPasswordError';

export class Password extends ValueObject<string> {
  private constructor(password: string) {
    super(password);
  }

  static create(password: string): Password {
    if (password.length < 8) {
      throw new InvalidPasswordError();
    }

    return new Password(password);
  }

  compare(password: string): boolean {
    return this._value === password;
  }
}
