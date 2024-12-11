import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { Movie } from './entity/movie';
import { MovieNotFoundError } from './error/movie/movieNotFoundError';
import { OnlyManagersCanUpdateMovieError } from './error/movie/onlyManagersCanUpdateMovieError';
import { MoviePort } from './port/moviePort';
import { UpdateMovieUseCase } from './useCase/updateMovieUseCase';

@injectable()
export class UpdateMovieUseCaseHandler implements UseCaseHandler<UpdateMovieUseCase, Movie> {
  constructor(
    @inject(InjectionToken.MoviePort)
    private readonly moviePort: MoviePort,
  ) {}

  async handle({ actor, movieId, movieName, ageRestriction }: UpdateMovieUseCase): Promise<Movie> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    if (!actor.isManager) {
      throw new OnlyManagersCanUpdateMovieError();
    }

    const existingMovie = await this.moviePort.findMovieById(movieId);
    if (!existingMovie) {
      throw new MovieNotFoundError(movieId);
    }

    const movie = Movie.update({ name: movieName, ageRestriction }, movieId);
    return this.moviePort.updateMovie(movie);
  }
}
