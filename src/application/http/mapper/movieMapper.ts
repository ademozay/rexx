import { AgeRestriction } from '../../../domain/movie/entity/ageRestriction';
import { Movie } from '../../../domain/movie/entity/movie';
import { SessionMapper, SessionResponse } from './sessionMapper';

export type MovieResponse = {
  id: string;
  name: string;
  ageRestriction: AgeRestriction;
  sessions?: SessionResponse[];
};

export class MovieMapper {
  static toResponse(movie: Movie): MovieResponse {
    return {
      id: movie.id,
      name: movie.name.value,
      ageRestriction: movie.ageRestriction,
      sessions: movie.sessions.map((session) => SessionMapper.toResponse(session)),
    };
  }
}
