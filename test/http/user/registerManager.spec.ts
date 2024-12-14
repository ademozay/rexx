import { UserRole } from '../../../src/domain/user/entity/userRole';
import { createMockUser } from '../../helper/createMockUser';
import { signIn } from '../../helper/signIn';
import { createHttpTestSetup, HttpTestSetup } from '../../http';

describe('register manager', () => {
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

  it('should register a manager', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    // act
    const response = await makePostRequest(
      '/api/v1/auth/register/manager',
      {
        email: 'another-user@rexx.com',
        password: 'password',
        passwordConfirmation: 'password',
        age: 20,
      },
      token,
    );

    // assert
    expect(response.status).toBe(201);
  });

  it('should return 500 when the email is already in use', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    // act
    const response = await makePostRequest(
      '/api/v1/auth/register/manager ',
      {
        email: user.email.value,
        password: 'anotherPassword',
        passwordConfirmation: 'anotherPassword',
        age: 20,
      },
      token,
    );

    // assert
    expect(response.status).toBe(409);
    expect(response.error).toEqual({
      message: `Email is already in use: ${user.email.value}`,
    });
  });

  it('should return 400 when the password is invalid', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    // act
    const response = await makePostRequest(
      '/api/v1/auth/register/manager',
      {
        email: 'manager@rexx.com',
        password: 'abc',
        passwordConfirmation: 'abc',
        age: 20,
      },
      token,
    );

    // assert
    expect(response.status).toBe(400);
    expect(response.validationErrors).toMatchObject(
      expect.arrayContaining([
        {
          field: 'password',
          message: 'Password must be at least 8 characters long',
        },
      ]),
    );
  });

  it('should return 401 when actor is not a manager', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);

    // act
    const response = await makePostRequest(
      '/api/v1/auth/register/manager',
      {
        email: 'john.doe@rexx.com',
        password: 'password',
        passwordConfirmation: 'password',
        age: 20,
      },
      token,
    );

    // assert
    expect(response.status).toBe(401);
    expect(response.error).toEqual({
      message: 'Only managers can register managers',
    });
  });

  it('should return 401 when actor is not found', async () => {
    const { makePostRequest } = setup;

    // act
    const response = await makePostRequest('/api/v1/auth/register/manager', {
      email: 'john.doe@rexx.com',
      password: 'password',
      passwordConfirmation: 'password',
      age: 20,
    });

    // assert
    expect(response.status).toBe(401);
    expect(response.error).toEqual({
      message: 'Unauthorized',
    });
  });
});
