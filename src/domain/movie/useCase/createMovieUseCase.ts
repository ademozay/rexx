import { Actor } from '../../shared/actor';
import { AgeRestriction } from '../entity/ageRestriction';

export class CreateMovieUseCase {
  constructor(
    readonly actor: Actor,
    readonly movieName: string,
    readonly ageRestriction: AgeRestriction,
  ) {}
}
