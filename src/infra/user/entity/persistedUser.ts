import { User } from '../../../domain/user/entity/user';
import { PersistedEntity } from '../../mongodb/persistedEntity';

export type PersistedUser = PersistedEntity<
  Pick<User, 'id' | 'role'> & {
    email: string;
    password: string;
    age: number;
  }
>;
