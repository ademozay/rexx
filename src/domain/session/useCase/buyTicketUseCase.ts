import { Actor } from '../../shared/actor';

export class BuyTicketUseCase {
  constructor(readonly actor: Actor, readonly sessionId: string) {}
}
