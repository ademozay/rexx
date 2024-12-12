import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { SessionAlreadyStartedError } from '../../../domain/movie/error/session/sessionAlreadyStartedError';
import { SessionExpiredError } from '../../../domain/movie/error/session/sessionExpiredError';
import { SessionNotFoundError } from '../../../domain/movie/error/session/sessionNotFoundError';
import { TicketAlreadySoldError } from '../../../domain/ticket/error/ticketAlreadySoldError';
import { UserTooYoungError } from '../../../domain/ticket/error/userTooYoungError';
import { logger } from '../../../logger';
import { TicketMapper } from '../mapper/ticketMapper';
import { createErrorResponse } from '../response';

@injectable()
export class TicketController {
  async buyTicket(request: Request, response: Response): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const sessionId = request.body.sessionId;
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
}
