import { AccessDeniedError } from '../../shared/accessDeniedError';

export class OnlyManagersCanCreateSessionError extends AccessDeniedError {
  constructor() {
    super('Only managers can create sessions');
  }
}
