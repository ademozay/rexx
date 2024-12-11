import { randomUUID } from 'crypto';
import { Session } from '../../src/domain/movie/entity/session';
import { MoviePort } from '../../src/domain/movie/port/moviePort';
import { TimeSlotLabel } from '../../src/domain/movie/valueObjects/timeSlot';

type SessionOverrides = {
  movieId?: string;
  sessionDate?: string;
  timeSlotLabel?: TimeSlotLabel;
  roomNumber?: number;
};

export async function createMockSession(
  moviePort: MoviePort,
  overrides: SessionOverrides,
): Promise<Session> {
  const session = Session.create({
    movieId: overrides.movieId ?? randomUUID(),
    sessionDate: overrides.sessionDate ?? '2024-08-22',
    timeSlotLabel: overrides.timeSlotLabel ?? TimeSlotLabel.Morning,
    roomNumber: overrides.roomNumber ?? 1,
  });

  return moviePort.createSession(session);
}
