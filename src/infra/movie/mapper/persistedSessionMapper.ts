import { Session } from '../../../domain/movie/entity/session';
import { PersistedSession } from '../../session/entity/persistedSession';

export class PersistedSessionMapper {
  static toDomain(persistedSession: PersistedSession): Session {
    return Session.hydrate(
      {
        movieId: persistedSession.movieId.toString(),
        sessionDate: persistedSession.sessionDate,
        timeSlotLabel: persistedSession.timeSlotLabel,
        roomNumber: persistedSession.roomNumber,
      },
      persistedSession._id.toString(),
    );
  }
}
