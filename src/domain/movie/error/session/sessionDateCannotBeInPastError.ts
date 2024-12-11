import { DomainError } from '../../../shared/domainError';
import { SessionDate } from '../../valueObjects/sessionDate';

export class SessionDateCannotBeInPastError extends DomainError {
  constructor(readonly sessionDate: SessionDate) {
    super(`Session date cannot be in the past`);
  }
}
