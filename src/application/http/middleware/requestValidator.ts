import { RequestHandler } from 'express';
import { z } from 'zod';
import { logger } from '../../../logger';
import { createErrorResponse, createValidationErrorResponse } from '../response';

export function createRequestValidatorMiddleware(schema: z.ZodType): RequestHandler {
  return (req, res, next) => {
    const { params, body, query } = req;

    try {
      schema.parse({ params, body, query });

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).send(createValidationErrorResponse(error));
        return;
      }

      logger.error('validation error', error);
      res.status(500).send(createErrorResponse('Internal server error'));
    }
  };
}
