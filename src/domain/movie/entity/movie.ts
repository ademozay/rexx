import { AggregateRoot } from '../../shared/aggregateRoot';
import { MovieName } from '../valueObjects/movieName';
import { AgeRestriction } from './ageRestriction';

interface MovieProps {
  name: MovieName;
  ageRestriction: AgeRestriction;
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

  isRestrictedForAge(age: number): boolean {
    return age < this.ageRestriction;
  }
}
