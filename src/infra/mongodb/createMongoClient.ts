import { MongoClient } from 'mongodb';

export async function createMongoClient(): Promise<MongoClient> {
  const mongodbUrl = process.env.MONGODB_URL;
  if (!mongodbUrl) {
    throw new Error('MONGODB_URL is not set');
  }

  const client = new MongoClient(mongodbUrl);
  return client.connect();
}
