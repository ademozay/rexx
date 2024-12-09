import { randomUUID } from 'crypto';
import { AgeRestriction } from '../../../src/domain/movie/entity/ageRestriction';
import { UserRole } from '../../../src/domain/user/entity/userRole';
import { createMockMovie } from '../../helper/createMockMovie';
import { createMockUser } from '../../helper/createMockUser';
import { signIn } from '../../helper/signIn';
import { HttpTestSetup, createHttpTestSetup } from '../../http';

describe('delete movie', () => {
  let setup: HttpTestSetup;

  beforeAll(async () => {
    setup = await createHttpTestSetup();
  });

  afterEach(async () => {
    await setup.resetState();
  });

  afterAll(async () => {
    await setup.teardown();
  });

  it('should delete a movie', async () => {
    const {
      makeDeleteRequest,
      ports: { userPort, moviePort },
    } = setup;

    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Elephant Man',
      ageRestriction: AgeRestriction.PG_13,
    });

    const response = await makeDeleteRequest(`/api/v1/movies/${movie.id}`, token);

    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(204);
  });

  it('should return 404 when movie is not found', async () => {
    const {
      makeDeleteRequest,
      ports: { userPort },
    } = setup;

    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movieId = randomUUID();

    const response = await makeDeleteRequest(`/api/v1/movies/${movieId}`, token);

    const error = response.getError();

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(404);
    expect(error).toEqual({
      message: `Movie not found: ${movieId}`,
    });
  });

  it('should return 401 when actor is not found', async () => {
    const { makeDeleteRequest } = setup;

    const movieId = randomUUID();
    const response = await makeDeleteRequest(`/api/v1/movies/${movieId}`);

    const error = response.getError();

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(401);
    expect(error).toEqual({
      message: 'Unauthorized',
    });
  });

  it('should return 403 when actor is not a manager', async () => {
    const {
      makeDeleteRequest,
      ports: { userPort, moviePort },
    } = setup;

    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Elephant Man',
      ageRestriction: AgeRestriction.PG_13,
    });

    const response = await makeDeleteRequest(`/api/v1/movies/${movie.id}`, token);

    const error = response.getError();

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(403);
    expect(error).toEqual({
      message: 'Only managers can delete movies',
    });
  });
});
