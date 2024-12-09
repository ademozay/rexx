import { DomainError } from '../../shared/domainError';

export class UserAlreadyRegisteredError extends DomainError {
  constructor(readonly email: string) {
    super(`Email is already in use: ${email}`);
  }
}
