import { UserRole } from '../user/entity/userRole';

type ActorProps = {
  id: string;
  role: UserRole;
  token: string;
};

export class Actor {
  private constructor(private readonly props: ActorProps) {}

  static create(props: Omit<ActorProps, 'token'>): Actor {
    // TODO: we should delegate token generation to infra layer
    const token = crypto.randomUUID();
    return new Actor({ ...props, token });
  }

  static hydrate(props: ActorProps): Actor {
    return new Actor(props);
  }

  canCreateUserForRole(role: UserRole): boolean {
    return this.props.role === UserRole.MANAGER && role === UserRole.CUSTOMER;
  }

  get id(): string {
    return this.props.id;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get token(): string {
    return this.props.token;
  }

  get isManager(): boolean {
    return this.props.role === UserRole.MANAGER;
  }
}
