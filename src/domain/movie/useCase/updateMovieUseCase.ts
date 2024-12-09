import { Actor } from '../../shared/actor';
import { AgeRestriction } from '../entity/ageRestriction';

export class UpdateMovieUseCase {
  constructor(
    readonly actor: Actor,
    readonly movieId: string,
    readonly movieName: string,
    readonly ageRestriction: AgeRestriction,
  ) {}
}
