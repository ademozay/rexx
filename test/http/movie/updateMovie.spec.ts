import { randomUUID } from 'crypto';
import { AgeRestriction } from '../../../src/domain/movie/entity/ageRestriction';
import { UserRole } from '../../../src/domain/user/entity/userRole';
import { createMockMovie } from '../../helper/createMockMovie';
import { createMockUser } from '../../helper/createMockUser';
import { signIn } from '../../helper/signIn';
import { HttpTestSetup, createHttpTestSetup } from '../../http';

describe('update movie', () => {
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

  it('should update a movie', async () => {
    const {
      makePutRequest,
      ports: { userPort, moviePort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Prestig',
      ageRestriction: AgeRestriction.PG_13,
    });

    const response = await makePutRequest(
      `/api/v1/movies/${movie.id}`,
      {
        name: 'Prestige',
        ageRestriction: AgeRestriction.PG_13,
      },
      token,
    );

    // assert
    expect(response.status).toBe(201);
    expect(response.data).toEqual({
      id: movie.id,
      name: 'Prestige',
      ageRestriction: AgeRestriction.PG_13,
      sessions: [],
    });
  });

  it('should return 400 when movie name is empty when trimmed', async () => {
    const {
      makePutRequest,
      ports: { userPort, moviePort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Prestige',
      ageRestriction: AgeRestriction.PG_13,
    });

    // act
    const response = await makePutRequest(
      `/api/v1/movies/${movie.id}`,
      {
        name: '   ',
        ageRestriction: AgeRestriction.PG_13,
      },
      token,
    );

    // assert
    expect(response.status).toBe(400);
    expect(response.error).toEqual({ message: 'Movie name cannot be empty' });
  });

  it('should return 401 when actor is not found', async () => {
    const {
      makePutRequest,
      ports: { moviePort },
    } = setup;

    // arrange
    const movie = await createMockMovie(moviePort, {
      name: 'Prestige',
      ageRestriction: AgeRestriction.PG_13,
    });

    // act
    const response = await makePutRequest(`/api/v1/movies/${movie.id}`, {
      name: 'Prestige',
      ageRestriction: AgeRestriction.PG_13,
    });

    // assert
    expect(response.status).toBe(401);
    expect(response.error).toEqual({ message: 'Unauthorized' });
  });

  it('should return 403 when actor is not a manager', async () => {
    const {
      makePutRequest,
      ports: { userPort, moviePort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Prestige',
      ageRestriction: AgeRestriction.PG_13,
    });

    // act
    const response = await makePutRequest(
      `/api/v1/movies/${movie.id}`,
      {
        name: 'Prestige',
        ageRestriction: AgeRestriction.PG_13,
      },
      token,
    );

    // assert
    expect(response.status).toBe(403);
    expect(response.error).toEqual({ message: 'Only managers can update movies' });
  });

  it('should return 404 when movie is not found', async () => {
    const {
      makePutRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movieId = randomUUID();

    // act
    const response = await makePutRequest(
      `/api/v1/movies/${movieId}`,
      {
        name: 'Prestige',
        ageRestriction: AgeRestriction.PG_13,
      },
      token,
    );

    // assert
    expect(response.status).toBe(404);
    expect(response.error).toEqual({ message: `Movie not found: ${movieId}` });
  });
});
