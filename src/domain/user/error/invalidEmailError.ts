import { DomainError } from '../../shared/domainError';

export class InvalidEmailError extends DomainError {
  constructor(readonly email: string) {
    super(`Invalid email: ${email}`);
  }
}
