import { DomainError } from '../../shared/domainError';

export class UserNotFoundError extends DomainError {
  constructor(readonly userId: string) {
    super(`User not found: ${userId}`);
  }
}
