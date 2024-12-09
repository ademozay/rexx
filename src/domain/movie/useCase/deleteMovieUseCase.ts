import { Actor } from '../../shared/actor';

export class DeleteMovieUseCase {
  constructor(readonly actor: Actor, readonly movieId: string) {}
}
