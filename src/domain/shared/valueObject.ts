export abstract class ValueObject<T> {
  protected readonly _value: T;

  protected constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  equals(other: ValueObject<T>): boolean {
    return other instanceof ValueObject && this.value === other.value;
  }

  toString(): string {
    return String(this.value);
  }
}
