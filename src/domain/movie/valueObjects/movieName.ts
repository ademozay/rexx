import { ValueObject } from '../../shared/valueObject';
import { MovieNameCannotBeEmptyError } from '../error/movie/movieNameCannotBeEmptyError';

export class MovieName extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): MovieName {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      throw new MovieNameCannotBeEmptyError();
    }

    return new MovieName(trimmedValue);
  }
}
