import { randomUUID } from 'crypto';
import { Session } from '../../src/domain/session/entity/session';
import { SessionPort } from '../../src/domain/session/port/sessionPort';
import { TimeSlotLabel } from '../../src/domain/session/valueObjects/timeSlot';

type SessionOverrides = {
  movieId?: string;
  sessionDate?: string;
  timeSlotLabel?: TimeSlotLabel;
  roomNumber?: number;
};

export async function createMockSession(
  sessionPort: SessionPort,
  overrides: SessionOverrides,
): Promise<Session> {
  const session = Session.create({
    movieId: overrides.movieId ?? randomUUID(),
    sessionDate: overrides.sessionDate ?? '2024-08-22',
    timeSlotLabel: overrides.timeSlotLabel ?? TimeSlotLabel.Morning,
    roomNumber: overrides.roomNumber ?? 1,
  });
  return sessionPort.createSession(session);
}
