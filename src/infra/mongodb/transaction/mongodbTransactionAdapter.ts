import { MongoClient } from 'mongodb';
import { Transaction } from '../../../domain/shared/transaction/transaction';
import { TransactionPort } from '../../../domain/shared/transaction/transactionPort';
import { MongodbTransaction } from './mongodbTransaction';

export class MongodbTransactionAdapter implements TransactionPort {
  constructor(private readonly client: MongoClient) {}

  async start(): Promise<Transaction> {
    const session = this.client.startSession();
    session.startTransaction();
    return new MongodbTransaction(session);
  }
}
