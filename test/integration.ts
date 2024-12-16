import { CompositionRoot, Ports } from '../src/compositionRoot';
import { createMongoClient } from '../src/infra/mongodb/createMongoClient';
import { MongodbTransactionAdapter } from '../src/infra/mongodb/transaction/mongodbTransactionAdapter';
import { MongodbMovieAdapter } from '../src/infra/movie/mongodbMovieAdapter';
import { MongodbTicketAdapter } from '../src/infra/session/mongodbTicketAdapter';
import { MongodbUserAdapter } from '../src/infra/user/mongodbUserAdapter';

export interface IntegrationTestSetupOptions {
  ports?: Partial<Ports>;
}

export interface IntegrationTestSetup {
  ports: Ports;
  resetState: () => Promise<void>;
  teardown: () => Promise<void>;
}

export async function createIntegrationTestSetup({
  ports,
}: IntegrationTestSetupOptions = {}): Promise<IntegrationTestSetup> {
  const compositionRoot = CompositionRoot.getInstance();

  const mongoClient = await createMongoClient();
  const databaseName = process.env.MONGODB_DATABASE ?? 'rexx-test';

  const mongodbTicketAdapter =
    ports?.ticketPort ?? new MongodbTicketAdapter(mongoClient, databaseName);
  const mongodbMovieAdapter =
    ports?.moviePort ?? new MongodbMovieAdapter(mongoClient, databaseName);
  const mongodbUserAdapter = ports?.userPort ?? new MongodbUserAdapter(mongoClient, databaseName);
  const mongodbTransactionAdapter =
    ports?.transactionPort ?? new MongodbTransactionAdapter(mongoClient);

  compositionRoot.bindServices();
  compositionRoot.bindControllers();
  compositionRoot.bindPorts({
    moviePort: mongodbMovieAdapter,
    ticketPort: mongodbTicketAdapter,
    userPort: mongodbUserAdapter,
    transactionPort: mongodbTransactionAdapter,
  });
  compositionRoot.bindUseCaseHandlers();
  compositionRoot.bindBaseContext();

  async function resetState() {
    const db = mongoClient.db(databaseName);
    const collections = await db.collections();
    await Promise.all(collections.map((collection) => collection.drop()));
  }

  await resetState();

  return {
    ports: {
      moviePort: mongodbMovieAdapter,
      ticketPort: mongodbTicketAdapter,
      userPort: mongodbUserAdapter,
      transactionPort: mongodbTransactionAdapter,
    },
    resetState,
    teardown: async () => {
      await mongoClient.close();
    },
  };
}
