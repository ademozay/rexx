import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../../injectionToken';
import { Movie } from '../entity/movie';
import { MovieNotFoundError } from '../error/movieNotFoundError';
import { MoviePort } from '../port/moviePort';

@injectable()
export class MovieService {
  constructor(
    @inject(InjectionToken.MoviePort)
    private readonly moviePort: MoviePort,
  ) {}

  async findMovieById(movieId: string): Promise<Movie> {
    const movie = await this.moviePort.findMovieById(movieId);
    if (!movie) {
      throw new MovieNotFoundError(movieId);
    }

    return movie;
  }
}
