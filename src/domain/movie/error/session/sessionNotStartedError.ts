import { DomainError } from '../../../shared/domainError';

export class SessionNotStartedError extends DomainError {
  constructor(readonly sessionId: string) {
    super(`Session not started: ${sessionId}`);
  }
}
