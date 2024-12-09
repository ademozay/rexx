import { Actor } from '../../shared/actor';
import { User } from '../entity/user';
import { WatchHistory } from '../entity/watchHistory';

export interface UserPort {
  createUser(user: User): Promise<User>;
  findUserById(userId: string): Promise<User | undefined>;
  findUserByEmail(email: string): Promise<User | undefined>;

  createWatchHistory(watchHistory: WatchHistory): Promise<void>;
  findWatchHistory(userId: string): Promise<WatchHistory[]>;

  createActor(actor: Actor): Promise<{ token: string }>;
  findActorByToken(token: string): Promise<Actor | undefined>;

  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
