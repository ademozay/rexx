import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { MovieNameCannotBeEmptyError } from '../../../domain/movie/error/movie/movieNameCannotBeEmptyError';
import { MovieNotFoundError } from '../../../domain/movie/error/movie/movieNotFoundError';
import { OnlyManagersCanCreateMovieError } from '../../../domain/movie/error/movie/onlyManagersCanCreateMovieError';
import { OnlyManagersCanDeleteMovieError } from '../../../domain/movie/error/movie/onlyManagersCanDeleteMovieError';
import { OnlyManagersCanUpdateMovieError } from '../../../domain/movie/error/movie/onlyManagersCanUpdateMovieError';
import { AgeRestrictionMapper } from '../../../domain/movie/mapper/ageRestrictionMapper';
import { AccessDeniedError } from '../../../domain/shared/accessDeniedError';
import { DomainError } from '../../../domain/shared/domainError';
import { logger } from '../../../logger';
import { MovieMapper } from '../mapper/movieMapper';
import { createErrorResponse } from '../response';

@injectable()
export class MovieController {
  async createMovie(request: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const movieName = request.body.name;
    if (!movieName) {
      response.status(400).json(createErrorResponse('missing name'));
      return;
    }

    const ageRestriction = request.body.ageRestriction;
    if (!ageRestriction) {
      response.status(400).json(createErrorResponse('missing age restriction'));
      return;
    }

    const {
      useCases: { createMovieUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const movie = await createMovieUseCaseHandler.handle({
        actor,
        movieName,
        ageRestriction: AgeRestrictionMapper.toDomain(ageRestriction),
      });

      response.status(201).json({
        data: MovieMapper.toResponse(movie),
      });
    } catch (error) {
      // TODO: we should use i18n to return localized response message for each domain error
      if (error instanceof OnlyManagersCanCreateMovieError) {
        response.status(403).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof MovieNameCannotBeEmptyError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error creating movie', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async updateMovie(request: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const movieId = request.params.id;
    if (!movieId) {
      response.status(400).json(createErrorResponse('missing movie id'));
      return;
    }

    const movieName = request.body.name;
    if (!movieName) {
      response.status(400).json(createErrorResponse('missing name'));
      return;
    }

    const ageRestriction = request.body.ageRestriction;
    if (!ageRestriction) {
      response.status(400).json(createErrorResponse('missing age restriction'));
      return;
    }

    const {
      useCases: { updateMovieUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const movie = await updateMovieUseCaseHandler.handle({
        actor,
        movieId,
        movieName,
        ageRestriction: AgeRestrictionMapper.toDomain(ageRestriction),
      });

      response.status(201).json({
        data: MovieMapper.toResponse(movie),
      });
    } catch (error) {
      if (error instanceof DomainError) {
        // TODO: we should use i18n to return localized response message for each domain error
        if (error instanceof MovieNotFoundError) {
          response.status(404).json(createErrorResponse(error.message));
          return;
        }

        if (error instanceof MovieNameCannotBeEmptyError) {
          response.status(400).json(createErrorResponse(error.message));
          return;
        }

        if (error instanceof OnlyManagersCanUpdateMovieError) {
          response.status(403).json(createErrorResponse(error.message));
          return;
        }
      }

      logger.error('error updating movie', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async deleteMovie(request: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const movieId = request.params.id;
    if (!movieId) {
      response.status(400).json(createErrorResponse('missing movie id'));
      return;
    }

    const {
      useCases: { deleteMovieUseCaseHandler },
    } = response.locals.httpContext;

    try {
      await deleteMovieUseCaseHandler.handle({
        actor,
        movieId,
      });

      response.status(204).send();
    } catch (error) {
      // TODO: we should use i18n to return localized response message for each domain error
      if (error instanceof MovieNotFoundError) {
        response.status(404).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof OnlyManagersCanDeleteMovieError) {
        response.status(403).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error deleting movie', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async listMovies(_: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const {
      useCases: { listMoviesUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const movies = await listMoviesUseCaseHandler.handle({ actor });

      response.status(200).json({
        data: movies.map(MovieMapper.toResponse),
      });
    } catch (error) {
      // TODO: we should handle this error in each endpoint
      if (error instanceof AccessDeniedError) {
        response.status(401).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error listing movies', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }
}
