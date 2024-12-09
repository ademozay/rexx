import 'express';
import { HttpContext } from '../../src/application/http/context';

declare global {
  namespace Express {
    interface Request {}

    interface Locals {
      httpContext: HttpContext;
    }
  }
}

export {};
