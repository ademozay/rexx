import { Actor } from '../../shared/actor';

export class FindMovieSessionsUseCase {
  constructor(readonly actor: Actor, readonly movieIds: string[]) {}
}
