import { DomainError } from '../../shared/domainError';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid credentials');
  }
}
