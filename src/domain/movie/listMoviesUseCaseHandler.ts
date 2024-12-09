import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { AccessDeniedError } from '../shared/accessDeniedError';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { Movie } from './entity/movie';
import { MoviePort } from './port/moviePort';
import { ListMoviesUseCase } from './useCase/listMoviesUseCase';

@injectable()
export class ListMoviesUseCaseHandler implements UseCaseHandler<ListMoviesUseCase, Movie[]> {
  constructor(
    @inject(InjectionToken.MoviePort)
    private readonly moviePort: MoviePort,
  ) {}

  async handle({ actor }: ListMoviesUseCase): Promise<Movie[]> {
    if (!actor) {
      throw new AccessDeniedError();
    }

    return this.moviePort.findAllMovies();
  }
}
