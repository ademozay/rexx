import { AccessDeniedError } from '../../shared/accessDeniedError';

export class OnlyManagersCanCreateMovieError extends AccessDeniedError {
  constructor() {
    super('Only managers can create movies');
  }
}
