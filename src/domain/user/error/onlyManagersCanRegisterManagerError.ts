import { AccessDeniedError } from '../../shared/accessDeniedError';

export class OnlyManagersCanRegisterManagerError extends AccessDeniedError {
  constructor() {
    super(`Only managers can register managers`);
  }
}
