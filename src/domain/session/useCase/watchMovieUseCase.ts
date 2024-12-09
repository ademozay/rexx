import { Actor } from '../../shared/actor';

export class WatchMovieUseCase {
  constructor(readonly actor: Actor, readonly ticketId: string) {}
}
