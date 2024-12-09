import { ValueObject } from '../../shared/valueObject';
import { InvalidEmailError } from '../error/invalidEmailError';

export class Email extends ValueObject<string> {
  private constructor(email: string) {
    super(email);
  }

  static create(email: string): Email {
    if (!email.includes('@')) {
      throw new InvalidEmailError(email);
    }

    return new Email(email);
  }
}
