import { AggregateRoot } from '../../shared/aggregateRoot';
import { MovieName } from '../valueObjects/movieName';
import { AgeRestriction } from './ageRestriction';
import { Session } from './session';

interface MovieProps {
  name: MovieName;
  ageRestriction: AgeRestriction;
  sessions?: Session[];
}

export class Movie extends AggregateRoot<MovieProps> {
  private constructor(props: MovieProps, id?: string) {
    super(props, id);
  }

  static create(props: Omit<MovieProps, 'name'> & { name: string }): Movie {
    return new Movie({ ...props, name: MovieName.create(props.name) });
  }

  static update(props: Omit<MovieProps, 'name'> & { name: string }, id: string): Movie {
    return new Movie({ ...props, name: MovieName.create(props.name) }, id);
  }

  static hydrate(props: Omit<MovieProps, 'name'> & { name: string }, id: string): Movie {
    return new Movie({ ...props, name: MovieName.create(props.name) }, id);
  }

  get name(): MovieName {
    return this.props.name;
  }

  get ageRestriction(): AgeRestriction {
    return this.props.ageRestriction;
  }

  get sessions(): Session[] {
    return this.props.sessions ?? [];
  }

  addSession(session: Session): Session {
    const sessions = this.props.sessions ?? [];
    sessions.push(session);
    this.props.sessions = sessions;
    return session;
  }

  addSessions(sessions: Session[]): void {
    if (!this.props.sessions) {
      this.props.sessions = [];
    }
    this.props.sessions.push(...sessions);
  }

  isRestrictedForAge(age: number): boolean {
    return age < this.ageRestriction;
  }
}
