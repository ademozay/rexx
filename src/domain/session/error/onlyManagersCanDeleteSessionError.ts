import { AccessDeniedError } from '../../shared/accessDeniedError';

export class OnlyManagersCanDeleteSessionError extends AccessDeniedError {
  constructor() {
    super('Only managers can delete session');
  }
}
