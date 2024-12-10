import 'express';
import { HttpContext } from '../../src/application/http/context';

declare module 'express-serve-static-core' {
  interface Locals {
    httpContext: HttpContext;
  }
}
