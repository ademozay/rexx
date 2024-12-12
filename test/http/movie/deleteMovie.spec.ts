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

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Elephant Man',
      ageRestriction: AgeRestriction.PG_13,
    });

    // act
    const response = await makeDeleteRequest(`/api/v1/movies/${movie.id}`, token);

    // assert
    expect(response.status).toBe(204);
  });

  it('should return 401 when actor is not found', async () => {
    const { makeDeleteRequest } = setup;

    // arrange
    const movieId = randomUUID();

    // act
    const response = await makeDeleteRequest(`/api/v1/movies/${movieId}`);

    // assert
    expect(response.status).toBe(401);
    expect(response.error).toEqual({ message: 'Unauthorized' });
  });

  it('should return 403 when actor is not a manager', async () => {
    const {
      makeDeleteRequest,
      ports: { userPort, moviePort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Elephant Man',
      ageRestriction: AgeRestriction.PG_13,
    });

    // act
    const response = await makeDeleteRequest(`/api/v1/movies/${movie.id}`, token);

    // assert
    expect(response.status).toBe(403);
    expect(response.error).toEqual({ message: 'Only managers can delete movies' });
  });

  it('should return 404 when movie is not found', async () => {
    const {
      makeDeleteRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movieId = randomUUID();

    // act
    const response = await makeDeleteRequest(`/api/v1/movies/${movieId}`, token);

    // assert
    expect(response.status).toBe(404);
    expect(response.error).toEqual({ message: `Movie not found: ${movieId}` });
  });
});
