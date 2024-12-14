import { User } from '../../src/domain/user/entity/user';
import { UserRole } from '../../src/domain/user/entity/userRole';
import { UserPort } from '../../src/domain/user/port/userPort';

type UserOverrides = {
  email?: string;
  password?: string;
  age?: number;
  role: UserRole;
};

export async function createMockUser(userPort: UserPort, overrides: UserOverrides): Promise<User> {
  const user = User.create({
    email: overrides.email ?? 'john-doe@rexx.com',
    password: overrides.password ?? 'password',
    age: overrides.age ?? 20,
    role: overrides.role,
  });
  return userPort.createUser(user);
}
