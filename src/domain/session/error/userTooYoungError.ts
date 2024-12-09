import { DomainError } from '../../shared/domainError';

export class UserTooYoungError extends DomainError {
  constructor(readonly userId: string, readonly ageRestriction: number) {
    super(`User is too young to watch this movie: ${userId}, age restriction: ${ageRestriction}`);
  }
}
