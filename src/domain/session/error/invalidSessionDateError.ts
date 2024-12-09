import { DomainError } from '../../shared/domainError';

export class InvalidSessionDateError extends DomainError {
  constructor(readonly sessionDate: string) {
    super(`Invalid session date: ${sessionDate}. Format: yyyy-MM-dd`);
  }
}
