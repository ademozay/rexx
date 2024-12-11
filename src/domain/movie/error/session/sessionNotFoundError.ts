import { DomainError } from '../../../shared/domainError';

export class SessionNotFoundError extends DomainError {
  constructor(readonly sessionId: string) {
    super(`Session not found: ${sessionId}`);
  }
}
