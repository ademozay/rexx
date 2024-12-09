import { ValueObject } from '../../shared/valueObject';
import { AgeCannotBeNegativeError } from '../error/ageCannotBeNegativeError';

export class Age extends ValueObject<number> {
  private constructor(value: number) {
    super(value);
  }

  static create(value: number): Age {
    if (value < 0) {
      throw new AgeCannotBeNegativeError();
    }

    return new Age(value);
  }
}
