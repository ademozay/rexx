import { DomainError } from '../../../shared/domainError';

export class MovieNotFoundError extends DomainError {
  constructor(readonly movieId: string) {
    super(`Movie not found: ${movieId}`);
  }
}
