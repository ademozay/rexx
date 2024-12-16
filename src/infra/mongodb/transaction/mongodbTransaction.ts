import { ClientSession } from 'mongodb';
import { Transaction } from '../../../domain/shared/transaction/transaction';

export class MongodbTransaction implements Transaction {
  constructor(public readonly session: ClientSession) {}

  async commit(): Promise<void> {
    await this.session.commitTransaction();
    await this.session.endSession();
  }

  async abort(): Promise<void> {
    await this.session.abortTransaction();
    await this.session.endSession();
  }
}
