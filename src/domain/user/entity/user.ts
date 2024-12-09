import { AggregateRoot } from '../../shared/aggregateRoot';
import { AgeCannotBeNegativeError } from '../error/ageCannotBeNegativeError';
import { Age } from '../valueObjects/age';
import { Email } from '../valueObjects/email';
import { Password } from '../valueObjects/password';
import { UserRole } from './userRole';

interface UserProps {
  email: Email;
  password: Password;
  age: Age;
  role: UserRole;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  static create(
    props: Omit<UserProps, 'email' | 'password' | 'age'> & {
      email: string;
      password: string;
      age: number;
    },
  ): User {
    if (props.age < 0) {
      throw new AgeCannotBeNegativeError();
    }

    return new User({
      ...props,
      email: Email.create(props.email),
      password: Password.create(props.password),
      age: Age.create(props.age),
    });
  }

  static hydrate(
    props: Omit<UserProps, 'email' | 'password' | 'age'> & {
      email: string;
      password: string;
      age: number;
    },
    id: string,
  ): User {
    return new User(
      {
        ...props,
        email: Email.create(props.email),
        password: Password.create(props.password),
        age: Age.create(props.age),
      },
      id,
    );
  }

  get email(): Email {
    return this.props.email;
  }

  // TODO: we should not expose the password
  get password(): Password {
    return this.props.password;
  }

  get age(): Age {
    return this.props.age;
  }

  get role(): UserRole {
    return this.props.role;
  }
}
