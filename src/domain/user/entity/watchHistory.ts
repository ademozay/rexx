import { Entity } from '../../shared/entity';

interface WatchHistoryProps {
  userId: string;
  movieId: string;
}

export class WatchHistory extends Entity<WatchHistoryProps> {
  private constructor(props: WatchHistoryProps, id?: string) {
    super(props, id);
  }

  static create(props: WatchHistoryProps): WatchHistory {
    return new WatchHistory(props);
  }

  static hydrate(props: WatchHistoryProps, id: string): WatchHistory {
    return new WatchHistory(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get movieId(): string {
    return this.props.movieId;
  }
}
