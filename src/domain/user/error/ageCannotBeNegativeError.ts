import { DomainError } from '../../shared/domainError';

export class AgeCannotBeNegativeError extends DomainError {
  constructor() {
    super('Age cannot be negative');
  }
}
