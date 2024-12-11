import { DomainError } from '../../../shared/domainError';

export class SessionExpiredError extends DomainError {
  constructor(readonly sessionId: string) {
    super(`Session expired: ${sessionId}`);
  }
}
