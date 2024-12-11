import { AccessDeniedError } from '../../../shared/accessDeniedError';

export class OnlyManagersCanUpdateMovieError extends AccessDeniedError {
  constructor() {
    super('Only managers can update movies');
  }
}
