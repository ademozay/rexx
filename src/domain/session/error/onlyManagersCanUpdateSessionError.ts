import { AccessDeniedError } from '../../shared/accessDeniedError';

export class OnlyManagersCanUpdateSessionError extends AccessDeniedError {
  constructor() {
    super('Only managers can update session');
  }
}
