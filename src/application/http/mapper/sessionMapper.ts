import { Session } from '../../../domain/movie/entity/session';
import { TimeSlotLabel } from '../../../domain/movie/valueObjects/timeSlot';

export type SessionResponse = {
  id: string;
  movieId: string;
  sessionDate: string;
  timeSlotLabel: TimeSlotLabel;
  roomNumber: number;
};

export class SessionMapper {
  static toResponse(session: Session): SessionResponse {
    return {
      id: session.id,
      movieId: session.movieId,
      sessionDate: session.sessionDate.value,
      timeSlotLabel: session.timeSlot.value,
      roomNumber: session.roomNumber,
    };
  }
}
