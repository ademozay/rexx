import { AccessDeniedError } from '../../../shared/accessDeniedError';

export class OnlyManagersCanDeleteMovieError extends AccessDeniedError {
  constructor() {
    super('Only managers can delete movies');
  }
}
