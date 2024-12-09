import { CompositionRoot, Ports } from '../src/compositionRoot';
import { createMongoClient } from '../src/infra/mongodb/createMongoClient';
import { MongodbMovieAdapter } from '../src/infra/movie/mongodbMovieAdapter';
import { MongodbSessionAdapter } from '../src/infra/session/mongodbSessionAdapter';
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

  const mongodbMovieAdapter = ports?.moviePort ?? new MongodbMovieAdapter(mongoClient);
  const mongodbSessionAdapter = ports?.sessionPort ?? new MongodbSessionAdapter(mongoClient);
  const mongodbUserAdapter = ports?.userPort ?? new MongodbUserAdapter(mongoClient);

  compositionRoot.bindServices();
  compositionRoot.bindControllers();
  compositionRoot.bindPorts({
    moviePort: mongodbMovieAdapter,
    sessionPort: mongodbSessionAdapter,
    userPort: mongodbUserAdapter,
  });
  compositionRoot.bindUseCaseHandlers();
  compositionRoot.bindBaseContext();

  async function resetState() {
    const db = mongoClient.db('rexx');
    const collections = await db.collections();
    await Promise.all(collections.map((collection) => collection.drop()));
  }

  await resetState();

  return {
    ports: {
      moviePort: mongodbMovieAdapter,
      sessionPort: mongodbSessionAdapter,
      userPort: mongodbUserAdapter,
    },
    resetState,
    teardown: async () => {
      await mongoClient.close();
    },
  };
}
