import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { MovieNameCannotBeEmptyError } from '../../../domain/movie/error/movieNameCannotBeEmptyError';
import { MovieNotFoundError } from '../../../domain/movie/error/movieNotFoundError';
import { OnlyManagersCanCreateMovieError } from '../../../domain/movie/error/onlyManagersCanCreateMovieError';
import { OnlyManagersCanDeleteMovieError } from '../../../domain/movie/error/onlyManagersCanDeleteMovieError';
import { OnlyManagersCanUpdateMovieError } from '../../../domain/movie/error/onlyManagersCanUpdateMovieError';
import { AgeRestrictionMapper } from '../../../domain/movie/mapper/ageRestrictionMapper';
import { Session } from '../../../domain/session/entity/session';
import { AccessDeniedError } from '../../../domain/shared/accessDeniedError';
import { DomainError } from '../../../domain/shared/domainError';
import { logger } from '../../../logger';
import { MovieMapper, MovieResponse } from '../mapper/movieMapper';
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
      useCases: { listMoviesUseCaseHandler, findMovieSessionsUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const movies = await listMoviesUseCaseHandler.handle({
        actor,
      });
      const movieIds = movies.map((movie) => movie.id);

      const sessions = await findMovieSessionsUseCaseHandler.handle({
        actor,
        movieIds,
      });
      const sessionsByMovieId = new Map<string, Session[]>();
      sessions.forEach((session) => {
        const movieSessions = sessionsByMovieId.get(session.movieId) ?? [];
        movieSessions.push(session);
        sessionsByMovieId.set(session.movieId, movieSessions);
      });

      const moviesWithSessions: MovieResponse[] = movies.map((movie) => {
        const movieSessions = sessionsByMovieId.get(movie.id) ?? [];
        return MovieMapper.toResponse(movie, movieSessions);
      });

      response.status(200).json({
        data: moviesWithSessions,
      });
    } catch (error) {
      logger.error('error listing movies', error);

      // TODO: we should handle this error in each endpoint
      if (error instanceof AccessDeniedError) {
        response.status(401).json(createErrorResponse(error.message));
        return;
      }

      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }
}
