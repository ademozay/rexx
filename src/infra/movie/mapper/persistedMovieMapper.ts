import { Movie } from '../../../domain/movie/entity/movie';
import { PersistedSession } from '../../session/entity/persistedSession';
import { PersistedMovie } from '../entity/persistedMovie';
import { PersistedSessionMapper } from './persistedSessionMapper';

export class PersistedMovieMapper {
  static toDomain(persistedMovie: PersistedMovie, persistedSessions: PersistedSession[]): Movie {
    const sessions = persistedSessions.map(PersistedSessionMapper.toDomain);
    const movie = Movie.hydrate(
      {
        name: persistedMovie.name,
        ageRestriction: persistedMovie.ageRestriction,
      },
      persistedMovie._id.toString(),
    );
    movie.addSessions(sessions);
    return movie;
  }
}
