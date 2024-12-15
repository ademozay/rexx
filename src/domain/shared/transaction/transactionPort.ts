import { Transaction } from './transaction';

export interface TransactionPort {
  start(): Promise<Transaction>;
}
