import bcrypt from 'bcryptjs';
import { Collection, MongoClient } from 'mongodb';
import { from } from 'uuid-mongodb';
import { Actor } from '../../domain/shared/actor';
import { User } from '../../domain/user/entity/user';
import { UserRole } from '../../domain/user/entity/userRole';
import { WatchHistory } from '../../domain/user/entity/watchHistory';
import { UserPort } from '../../domain/user/port/userPort';
import { PersistedAuth } from './entity/persistedAuth';
import { PersistedUser } from './entity/persistedUser';
import { PersistedWatchHistory } from './entity/persistedWatchHistory';

export class MongodbUserAdapter implements UserPort {
  private readonly authCollection: Collection<PersistedAuth>;

  private readonly userCollection: Collection<PersistedUser>;

  private readonly watchHistoryCollection: Collection<PersistedWatchHistory>;

  constructor(mongoClient: MongoClient) {
    this.authCollection = mongoClient.db('rexx').collection('auth');
    this.userCollection = mongoClient.db('rexx').collection('user');
    this.watchHistoryCollection = mongoClient.db('rexx').collection('watchHistory');
  }

  async createIndexes(): Promise<void> {
    await this.authCollection.createIndex({ token: 1 }, { unique: true });
    await this.userCollection.createIndex({ email: 1 }, { unique: true });
    await this.userCollection.createIndex({ email: 1, password: 1 });
    await this.watchHistoryCollection.createIndex({ userId: 1 });
  }

  async createRootUser(): Promise<void> {
    const rootUser = await this.findUserByEmail('root@rexx.com');
    if (rootUser) {
      return;
    }

    const user = User.create({
      email: 'root@rexx.com',
      password: 'password',
      age: 20,
      role: UserRole.MANAGER,
    });

    await this.createUser(user);
  }

  async createUser(user: User): Promise<User> {
    const hashedPassword = bcrypt.hashSync(user.password.value, 10);
    await this.userCollection.insertOne({
      _id: from(user.id),
      email: user.email.value,
      age: user.age.value,
      role: user.role,
      password: hashedPassword,
    });

    return user;
  }

  async findUserById(userId: string): Promise<User | undefined> {
    const user = await this.userCollection.findOne({ _id: from(userId) });
    if (!user) {
      return undefined;
    }

    return User.hydrate(
      {
        email: user.email,
        age: user.age,
        role: user.role,
        password: user.password,
      },
      user._id.toString(),
    );
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.userCollection.findOne({ email });
    if (!user) {
      return undefined;
    }

    return User.hydrate(
      {
        email: user.email,
        age: user.age,
        role: user.role,
        password: user.password,
      },
      user._id.toString(),
    );
  }

  async createWatchHistory(watchHistory: WatchHistory): Promise<void> {
    await this.watchHistoryCollection.insertOne({
      _id: from(watchHistory.id),
      userId: watchHistory.userId,
      movieId: watchHistory.movieId,
    });
  }

  async findWatchHistory(userId: string): Promise<WatchHistory[]> {
    const watchHistory = await this.watchHistoryCollection.find({ userId }).toArray();

    return watchHistory.map(({ _id, movieId }) =>
      WatchHistory.hydrate({ userId, movieId }, _id.toString()),
    );
  }

  async createActor(actor: Actor): Promise<{ token: string }> {
    await this.authCollection.insertOne({ userId: from(actor.id), token: actor.token });
    return { token: actor.token };
  }

  async findActorByToken(token: string): Promise<Actor | undefined> {
    const auth = await this.authCollection.findOne({ token });
    if (!auth) {
      return undefined;
    }

    const user = await this.userCollection.findOne({ _id: auth.userId });
    if (!user) {
      return undefined;
    }

    return Actor.hydrate({
      id: user._id.toString(),
      role: user.role,
      token: auth.token,
    });
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
