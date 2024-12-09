import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../injectionToken';
import { UseCaseHandler } from '../shared/useCaseHandler';
import { WatchHistory } from './entity/watchHistory';
import { UserPort } from './port/userPort';
import { GetWatchHistoryUseCase } from './useCase/getWatchHistoryUseCase';

@injectable()
export class GetWatchHistoryUseCaseHandler
  implements UseCaseHandler<GetWatchHistoryUseCase, WatchHistory[]>
{
  constructor(
    @inject(InjectionToken.UserPort)
    private readonly userPort: UserPort,
  ) {}

  async handle({ actorId }: GetWatchHistoryUseCase): Promise<WatchHistory[]> {
    return this.userPort.findWatchHistory(actorId);
  }
}
