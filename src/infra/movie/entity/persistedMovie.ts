import { Movie } from '../../../domain/movie/entity/movie';
import { PersistedEntity } from '../../mongodb/persistedEntity';

export type PersistedMovie = PersistedEntity<
  Pick<Movie, 'id' | 'ageRestriction'> & {
    name: string;
  }
>;
