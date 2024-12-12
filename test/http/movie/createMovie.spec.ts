import { AgeRestriction } from '../../../src/domain/movie/entity/ageRestriction';
import { UserRole } from '../../../src/domain/user/entity/userRole';
import { createMockUser } from '../../helper/createMockUser';
import { signIn } from '../../helper/signIn';
import { HttpTestSetup, createHttpTestSetup } from '../../http';

describe('create movie', () => {
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

  it('should create a movie', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    // act
    const response = await makePostRequest(
      '/api/v1/movies',
      {
        name: 'Truman Show',
        ageRestriction: AgeRestriction.PG_7,
      },
      token,
    );

    // assert
    expect(response.status).toBe(201);
    expect(response.data).toEqual({
      id: expect.any(String),
      name: 'Truman Show',
      ageRestriction: AgeRestriction.PG_7,
      sessions: [],
    });
  });

  it('should return 400 when movie name is empty when trimmed', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    // act
    const response = await makePostRequest(
      '/api/v1/movies',
      {
        name: '  ',
        ageRestriction: AgeRestriction.PG_7,
      },
      token,
    );

    // assert
    expect(response.status).toBe(400);
    expect(response.error).toEqual({ message: 'Movie name cannot be empty' });
  });

  it('should return 401 when actor is not found', async () => {
    const { makePostRequest } = setup;

    // act
    const response = await makePostRequest('/api/v1/movies', {
      name: 'Truman Show',
      ageRestriction: AgeRestriction.PG_7,
    });

    // assert
    expect(response.status).toBe(401);
    expect(response.error).toEqual({ message: 'Unauthorized' });
  });

  it('should return 403 when actor is not a manager', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);

    // act
    const response = await makePostRequest(
      '/api/v1/movies',
      {
        name: 'Truman Show',
        ageRestriction: AgeRestriction.PG_7,
      },
      token,
    );

    // assert
    expect(response.status).toBe(403);
    expect(response.error).toEqual({ message: 'Only managers can create movies' });
  });
});
