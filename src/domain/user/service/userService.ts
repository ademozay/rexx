import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../../injectionToken';
import { WatchHistory } from '../entity/watchHistory';
import { UserNotFoundError } from '../error/userNotFoundError';
import { UserPort } from '../port/userPort';

@injectable()
export class UserService {
  constructor(
    @inject(InjectionToken.UserPort)
    private readonly userPort: UserPort,
  ) {}

  async createWatchHistory(watchHistory: WatchHistory): Promise<void> {
    await this.userPort.createWatchHistory(watchHistory);
  }

  async getUserAge(userId: string): Promise<number> {
    const user = await this.userPort.findUserById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return user.age.value;
  }
}
