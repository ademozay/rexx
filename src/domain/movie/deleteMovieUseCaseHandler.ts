import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { MovieNotFoundError } from './error/movie/movieNotFoundError';
import { OnlyManagersCanDeleteMovieError } from './error/movie/onlyManagersCanDeleteMovieError';
import { MoviePort } from './port/moviePort';
import { DeleteMovieUseCase } from './useCase/deleteMovieUseCase';

@injectable()
export class DeleteMovieUseCaseHandler implements UseCaseHandler<DeleteMovieUseCase, void> {
  constructor(
    @inject(InjectionToken.MoviePort)
    private readonly moviePort: MoviePort,
  ) {}

  async handle({ actor, movieId }: DeleteMovieUseCase): Promise<void> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    if (!actor.isManager) {
      throw new OnlyManagersCanDeleteMovieError();
    }

    const existingMovie = await this.moviePort.findMovieById(movieId);
    if (!existingMovie) {
      throw new MovieNotFoundError(movieId);
    }

    await this.moviePort.deleteMovie(movieId);
  }
}
