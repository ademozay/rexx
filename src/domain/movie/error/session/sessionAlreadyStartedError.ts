import { DomainError } from '../../../shared/domainError';

export class SessionAlreadyStartedError extends DomainError {
  constructor(readonly sessionId: string) {
    super(`Session already started: ${sessionId}`);
  }
}
