export interface Transaction {
  /**
   * This is a hack to get the MongoDB session from the transaction.
   * MongoDB requires a session to be passed to each operation and
   * does not allow us to execute operations in a transactional scope.
   * This is a temporary solution until we find a better one.
   */
  session: unknown;
  commit(): Promise<void>;
  abort(): Promise<void>;
}
