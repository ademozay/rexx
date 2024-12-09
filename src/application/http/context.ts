import express from 'express';
import { BaseContext } from '../../context';
import { Actor } from '../../domain/shared/actor';

export interface HttpContext extends BaseContext {
  actor?: Actor;
}

export function makeHttpContextCreator(
  baseContext: BaseContext,
): (token: string) => Promise<HttpContext> {
  return async (token: string) => {
    const { findActorByTokenUseCaseHandler } = baseContext.useCases;
    const actor = await findActorByTokenUseCaseHandler.handle({ token });

    return {
      ...baseContext,
      actor,
    };
  };
}

export function createHttpContextMiddlewareCreator(
  baseContext: BaseContext,
): express.RequestHandler {
  return async (req, res, next) => {
    const httpContextCreator = makeHttpContextCreator(baseContext);
    const token = req.headers.authorization?.replace('Bearer ', '') ?? '';
    res.locals.httpContext = await httpContextCreator(token);
    next();
  };
}
