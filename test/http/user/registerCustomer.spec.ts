import { UserRole } from '../../../src/domain/user/entity/userRole';
import { createMockUser } from '../../helper/createMockUser';
import { createHttpTestSetup, HttpTestSetup } from '../../http';

describe('register customer', () => {
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

  it('should register a customer', async () => {
    const { makePostRequest } = setup;

    // act
    const response = await makePostRequest('/api/v1/auth/register/customer', {
      email: 'john.doe@rexx.com',
      password: 'password',
      passwordConfirmation: 'password',
      age: 20,
    });

    // assert
    expect(response.status).toBe(201);
  });

  it('should return 400 when the password is invalid', async () => {
    const { makePostRequest } = setup;

    // act
    const response = await makePostRequest('/api/v1/auth/register/customer', {
      email: 'john.doe@rexx.com',
      password: 'rexx',
      passwordConfirmation: 'rexx',
      age: 20,
    });

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

  it('should return 409 when the email is already in use', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });

    // act
    const response = await makePostRequest('/api/v1/auth/register/customer', {
      email: user.email.value,
      password: 'anotherPassword',
      passwordConfirmation: 'anotherPassword',
      age: 20,
    });

    // assert
    expect(response.status).toBe(409);
    expect(response.error).toEqual({
      message: `Email is already in use: ${user.email.value}`,
    });
  });
});
