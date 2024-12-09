import { ValueObject } from '../../shared/valueObject';
import { InvalidSessionDateError } from '../error/invalidSessionDateError';

function isValidISO8601Date(date: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    return false;
  }

  const parsedDate = Date.parse(date);
  const isValid = !isNaN(parsedDate);
  return isValid;
}

export class SessionDate extends ValueObject<string> {
  private constructor(sessionDate: string) {
    super(sessionDate);
  }

  static create(sessionDate: string): SessionDate {
    if (!isValidISO8601Date(sessionDate)) {
      throw new InvalidSessionDateError(sessionDate);
    }

    return new SessionDate(sessionDate);
  }

  get date(): Date {
    return new Date(this.value);
  }
}
