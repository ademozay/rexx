import { randomUUID } from 'crypto';
export abstract class Entity<T> {
  protected readonly props: T;

  private readonly _id: string;

  protected constructor(props: T, id?: string) {
    // TODO: validate id is a valid uuid
    this.props = props;
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  equals(entity: Entity<T>): boolean {
    if (this === entity) {
      return true;
    }

    return this._id === entity._id;
  }
}
