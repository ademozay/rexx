import { Actor } from '../../shared/actor';

export class DeleteSessionUseCase {
  constructor(readonly actor: Actor, readonly sessionId: string) {}
}
