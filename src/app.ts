import './setup';

import { Server } from './application/http/server';
import { CompositionRoot } from './compositionRoot';
import { logger } from './logger';

async function main() {
  const compositionRoot = CompositionRoot.getInstance();
  await compositionRoot.bind();

  const { baseContext, controllers } = compositionRoot;

  const httpPort = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 8080;
  const server = Server.create(baseContext, controllers, httpPort);
  server.bootstrap();
  await server.start();

  logger.info('🚀 rexx is running');
}

main().catch((error) => {
  logger.error('🔥 unhandled error:', error);
  process.exit(1);
});
