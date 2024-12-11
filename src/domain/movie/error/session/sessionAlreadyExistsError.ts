import { DomainError } from '../../../shared/domainError';
import { TimeSlotLabel } from '../../valueObjects/timeSlot';

export class SessionAlreadyExistsError extends DomainError {
  constructor(
    readonly movieId: string,
    readonly roomNumber: number,
    readonly sessionDate: string,
    readonly timeSlotLabel: TimeSlotLabel,
  ) {
    super(`Session already exists`);
  }
}
