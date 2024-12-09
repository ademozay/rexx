import { Actor } from '../../src/domain/shared/actor';
import { User } from '../../src/domain/user/entity/user';
import { UserPort } from '../../src/domain/user/port/userPort';

export async function signIn(userPort: UserPort, user: User): Promise<string> {
  const actor = Actor.create({
    id: user.id,
    role: user.role,
  });
  await userPort.createActor(actor);
  return actor.token;
}
