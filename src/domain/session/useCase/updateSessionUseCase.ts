import { Actor } from '../../shared/actor';
import { TimeSlotLabel } from '../valueObjects/timeSlot';

export class UpdateSessionUseCase {
  constructor(
    readonly actor: Actor,
    readonly sessionId: string,
    readonly movieId: string,
    /**
     * ISO 8601 Date (YYYY-mm-DD)
     */
    readonly sessionDate: string,
    readonly timeSlotLabel: TimeSlotLabel,
    readonly roomNumber: number,
  ) {}
}
