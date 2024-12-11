import { DomainError } from '../../../shared/domainError';

export class MovieNameCannotBeEmptyError extends DomainError {
  constructor() {
    super('Movie name cannot be empty');
  }
}
