import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { OnlyManagersCanCreateSessionError } from '../../../domain/session/error/onlyManagersCanCreateSessionError';
import { SessionAlreadyExistsError } from '../../../domain/session/error/sessionAlreadyExistsError';
import { SessionAlreadyStartedError } from '../../../domain/session/error/sessionAlreadyStartedError';
import { SessionDateCannotBeInPastError } from '../../../domain/session/error/sessionDateCannotBeInPastError';
import { SessionExpiredError } from '../../../domain/session/error/sessionExpiredError';
import { SessionNotFoundError } from '../../../domain/session/error/sessionNotFoundError';
import { SessionNotStartedError } from '../../../domain/session/error/sessionNotStartedError';
import { TicketAlreadySoldError } from '../../../domain/session/error/ticketAlreadySoldError';
import { TicketAlreadyUsedError } from '../../../domain/session/error/ticketAlreadyUsedError';
import { TicketNotFoundError } from '../../../domain/session/error/ticketNotFoundError';
import { TicketUserMismatchError } from '../../../domain/session/error/ticketUserMismatchError';
import { UserTooYoungError } from '../../../domain/session/error/userTooYoungError';
import { DomainError } from '../../../domain/shared/domainError';
import { logger } from '../../../logger';
import { SessionMapper } from '../mapper/sessionMapper';
import { TicketMapper } from '../mapper/ticketMapper';
import { createErrorResponse } from '../response';

@injectable()
export class SessionController {
  async createSession(request: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const movieId = request.body.movieId;
    if (!movieId) {
      response.status(400).json(createErrorResponse('missing movie id'));
      return;
    }

    const sessionDate = request.body.sessionDate;
    if (!sessionDate) {
      response.status(400).json(createErrorResponse('missing session date'));
      return;
    }

    const timeSlotLabel = request.body.timeSlotLabel;
    if (!timeSlotLabel) {
      response.status(400).json(createErrorResponse('missing time slot label'));
      return;
    }

    const roomNumber = request.body.roomNumber;
    if (!roomNumber) {
      response.status(400).json(createErrorResponse('missing room number'));
      return;
    }

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

      logger.error('error creating session', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async updateSession(request: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const sessionId = request.params.id;
    if (!sessionId) {
      response.status(400).json(createErrorResponse('missing session id'));
      return;
    }

    const movieId = request.body.movieId;
    if (!movieId) {
      response.status(400).json(createErrorResponse('missing movie id'));
      return;
    }

    const sessionDate = request.body.sessionDate;
    if (!sessionDate) {
      response.status(400).json(createErrorResponse('missing session date'));
      return;
    }

    const timeSlotLabel = request.body.timeSlotLabel;
    if (!timeSlotLabel) {
      response.status(400).json(createErrorResponse('missing time slot label'));
      return;
    }

    const roomNumber = request.body.roomNumber;
    if (!roomNumber) {
      response.status(400).json(createErrorResponse('missing room number'));
      return;
    }

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
      logger.error('error updating session', error);

      if (error instanceof DomainError) {
        // TODO: we should handle each domain error here
        // and return respective http status code and localized response message
        response.status(500).json(createErrorResponse(error.message));
        return;
      }

      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async deleteSession(request: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const sessionId = request.params.id;
    if (!sessionId) {
      response.status(400).json(createErrorResponse('missing session id'));
      return;
    }

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
      logger.error('error deleting session', error);

      if (error instanceof DomainError) {
        // TODO: we should handle each domain error here
        // and return respective http status code and localized response message
        response.status(500).json(createErrorResponse(error.message));
        return;
      }

      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async buyTicket(request: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const sessionId = request.params.id;
    if (!sessionId) {
      response.status(400).json(createErrorResponse('missing session id'));
      return;
    }

    const {
      useCases: { buyTicketUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const ticket = await buyTicketUseCaseHandler.handle({
        actor,
        sessionId,
      });

      response.status(201).json({
        data: TicketMapper.toResponse(ticket),
      });
    } catch (error) {
      // TODO: we should handle each domain error here
      // and return respective http status code and localized response message

      if (error instanceof TicketAlreadySoldError) {
        response.status(400).json(createErrorResponse(error.message));
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

      if (error instanceof SessionExpiredError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof UserTooYoungError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error buying ticket', error);
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async watchMovie(request: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const ticketId = request.params.ticketId;
    if (!ticketId) {
      response.status(400).json(createErrorResponse('missing ticket id'));
      return;
    }

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
