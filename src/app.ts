import './setup';

import { CompositionRoot } from './compositionRoot';
import { logger } from './logger';

async function main() {
  CompositionRoot.register();
}

main().catch((error) => {
  logger.error('🔥 unhandled error:', error);
  process.exit(1);
});
