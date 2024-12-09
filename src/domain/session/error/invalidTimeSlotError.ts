import { DomainError } from '../../shared/domainError';
import { TimeSlot } from '../valueObjects/timeSlot';

export class InvalidTimeSlotError extends DomainError {
  constructor(readonly timeSlot: TimeSlot) {
    super(`Invalid time slot: ${timeSlot}`);
  }
}
