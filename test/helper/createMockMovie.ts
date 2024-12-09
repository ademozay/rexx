import { AgeRestriction } from '../../src/domain/movie/entity/ageRestriction';
import { Movie } from '../../src/domain/movie/entity/movie';
import { MoviePort } from '../../src/domain/movie/port/moviePort';

type MovieOverrides = {
  name?: string;
  ageRestriction?: AgeRestriction;
};

export async function createMockMovie(
  moviePort: MoviePort,
  overrides: MovieOverrides,
): Promise<Movie> {
  const movie = Movie.create({
    name: overrides.name ?? 'Prestige',
    ageRestriction: overrides.ageRestriction ?? AgeRestriction.PG_13,
  });
  return moviePort.createMovie(movie);
}
