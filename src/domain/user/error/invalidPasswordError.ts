import { DomainError } from '../../shared/domainError';

export class InvalidPasswordError extends DomainError {
  constructor() {
    super('Invalid password. Password must be at least 8 characters long');
  }
}
