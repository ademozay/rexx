import { AgeRestriction } from '../../../domain/movie/entity/ageRestriction';
import { Movie } from '../../../domain/movie/entity/movie';
import { Session } from '../../../domain/session/entity/session';
import { SessionMapper, SessionResponse } from './sessionMapper';

export type MovieResponse = {
  id: string;
  name: string;
  ageRestriction: AgeRestriction;
  sessions?: SessionResponse[];
};

export class MovieMapper {
  static toResponse(movie: Movie, sessions?: Session[]): MovieResponse {
    if (!sessions) {
      return {
        id: movie.id,
        name: movie.name.value,
        ageRestriction: movie.ageRestriction,
      };
    }

    return {
      id: movie.id,
      name: movie.name.value,
      ageRestriction: movie.ageRestriction,
      sessions: sessions.map((session) => SessionMapper.toResponse(session)),
    };
  }
}
