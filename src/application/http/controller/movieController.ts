import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { MovieNameCannotBeEmptyError } from '../../../domain/movie/error/movie/movieNameCannotBeEmptyError';
import { MovieNotFoundError } from '../../../domain/movie/error/movie/movieNotFoundError';
import { OnlyManagersCanCreateMovieError } from '../../../domain/movie/error/movie/onlyManagersCanCreateMovieError';
import { OnlyManagersCanDeleteMovieError } from '../../../domain/movie/error/movie/onlyManagersCanDeleteMovieError';
import { OnlyManagersCanUpdateMovieError } from '../../../domain/movie/error/movie/onlyManagersCanUpdateMovieError';
import { OnlyManagersCanCreateSessionError } from '../../../domain/movie/error/session/onlyManagersCanCreateSessionError';
import { OnlyManagersCanDeleteSessionError } from '../../../domain/movie/error/session/onlyManagersCanDeleteSessionError';
import { OnlyManagersCanUpdateSessionError } from '../../../domain/movie/error/session/onlyManagersCanUpdateSessionError';
import { SessionAlreadyExistsError } from '../../../domain/movie/error/session/sessionAlreadyExistsError';
import { SessionAlreadyStartedError } from '../../../domain/movie/error/session/sessionAlreadyStartedError';
import { SessionDateCannotBeInPastError } from '../../../domain/movie/error/session/sessionDateCannotBeInPastError';
import { SessionExpiredError } from '../../../domain/movie/error/session/sessionExpiredError';
import { SessionNotFoundError } from '../../../domain/movie/error/session/sessionNotFoundError';
import { SessionNotStartedError } from '../../../domain/movie/error/session/sessionNotStartedError';
import { AgeRestrictionMapper } from '../../../domain/movie/mapper/ageRestrictionMapper';
import { AccessDeniedError } from '../../../domain/shared/accessDeniedError';
import { DomainError } from '../../../domain/shared/domainError';
import { TicketAlreadyUsedError } from '../../../domain/ticket/error/ticketAlreadyUsedError';
import { TicketNotFoundError } from '../../../domain/ticket/error/ticketNotFoundError';
import { TicketUserMismatchError } from '../../../domain/ticket/error/ticketUserMismatchError';
import { logger } from '../../../logger';
import { CreateMovieBody } from '../../schema/movie/createMovie';
import { CreateSessionBody } from '../../schema/movie/createSession';
import { DeleteMovieParams } from '../../schema/movie/deleteMovie';
import { DeleteSessionParams } from '../../schema/movie/deleteSession';
import { UpdateMovieBody, UpdateMovieParams } from '../../schema/movie/updateMovie';
import { UpdateSessionBody, UpdateSessionParams } from '../../schema/movie/updateSession';
import { WatchMovieParams } from '../../schema/movie/watchMovie';
import { MovieMapper } from '../mapper/movieMapper';
import { SessionMapper } from '../mapper/sessionMapper';
import { createErrorResponse } from '../response';

@injectable()
export class MovieController {
  async createMovie(
    request: Request<unknown, unknown, CreateMovieBody>,
    response: Response,
  ): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const { name, ageRestriction } = request.body;

    const {
      useCases: { createMovieUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const movie = await createMovieUseCaseHandler.handle({
        actor,
        movieName: name,
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

  async updateMovie(
    request: Request<UpdateMovieParams, unknown, UpdateMovieBody>,
    response: Response,
  ): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const { movieId } = request.params;
    const { name, ageRestriction } = request.body;

    const {
      useCases: { updateMovieUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const movie = await updateMovieUseCaseHandler.handle({
        actor,
        movieId,
        movieName: name,
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

  async deleteMovie(request: Request<DeleteMovieParams>, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const { movieId } = request.params;

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

  async createSession(
    request: Request<unknown, unknown, CreateSessionBody>,
    response: Response,
  ): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const { movieId, sessionDate, timeSlotLabel, roomNumber } = request.body;

    const {
      useCases: { createSessionUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const session = await createSessionUseCaseHandler.handle({
        actor,
        movieId,
        sessionDate,
        timeSlotLabel,
        roomNumber,
      });

      response.status(201).json({
        data: SessionMapper.toResponse(session),
      });
    } catch (error) {
      if (error instanceof OnlyManagersCanCreateSessionError) {
        response.status(403).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionDateCannotBeInPastError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionAlreadyExistsError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof MovieNotFoundError) {
        response.status(404).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error creating session', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async updateSession(
    request: Request<UpdateSessionParams, unknown, UpdateSessionBody>,
    response: Response,
  ): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const { sessionId } = request.params;
    const { movieId, sessionDate, timeSlotLabel, roomNumber } = request.body;

    const {
      useCases: { updateSessionUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const session = await updateSessionUseCaseHandler.handle({
        actor,
        sessionId,
        movieId,
        sessionDate,
        timeSlotLabel,
        roomNumber,
      });

      response.status(200).json({
        data: SessionMapper.toResponse(session),
      });
    } catch (error) {
      if (error instanceof OnlyManagersCanUpdateSessionError) {
        response.status(403).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionNotFoundError) {
        response.status(404).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionExpiredError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionAlreadyStartedError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionDateCannotBeInPastError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof MovieNotFoundError) {
        response.status(404).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error updating session', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async deleteSession(request: Request<DeleteSessionParams>, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const { sessionId } = request.params;

    const {
      useCases: { deleteSessionUseCaseHandler },
    } = response.locals.httpContext;

    try {
      await deleteSessionUseCaseHandler.handle({
        actor,
        sessionId,
      });

      response.status(204).send();
    } catch (error) {
      if (error instanceof OnlyManagersCanDeleteSessionError) {
        response.status(403).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionNotFoundError) {
        response.status(404).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionAlreadyStartedError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error deleting session', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async watchMovie(request: Request<WatchMovieParams>, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const { ticketId } = request.params;

    const {
      useCases: { watchMovieUseCaseHandler },
    } = response.locals.httpContext;

    try {
      await watchMovieUseCaseHandler.handle({
        actor,
        ticketId,
      });

      response.status(204).send();
    } catch (error) {
      if (error instanceof TicketNotFoundError) {
        response.status(404).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof TicketAlreadyUsedError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof TicketUserMismatchError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionNotFoundError) {
        response.status(404).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionNotStartedError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof SessionExpiredError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error watching movie', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }
}
