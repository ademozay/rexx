import { MUUID } from 'uuid-mongodb';
import { WatchHistory } from '../../../domain/user/entity/watchHistory';
import { PersistedEntity } from '../../mongodb/persistedEntity';

export type PersistedWatchHistory = PersistedEntity<
  Pick<WatchHistory, 'id'> & {
    userId: MUUID;
    movieId: MUUID;
  }
>;
