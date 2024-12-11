import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { Movie } from './entity/movie';
import { OnlyManagersCanCreateMovieError } from './error/movie/onlyManagersCanCreateMovieError';
import { MoviePort } from './port/moviePort';
import { CreateMovieUseCase } from './useCase/createMovieUseCase';

@injectable()
export class CreateMovieUseCaseHandler implements UseCaseHandler<CreateMovieUseCase, Movie> {
  constructor(
    @inject(InjectionToken.MoviePort)
    private readonly moviePort: MoviePort,
  ) {}

  async handle({ actor, movieName, ageRestriction }: CreateMovieUseCase): Promise<Movie> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    if (!actor.isManager) {
      throw new OnlyManagersCanCreateMovieError();
    }

    const movie = Movie.create({ name: movieName, ageRestriction });
    return this.moviePort.createMovie(movie);
  }
}
