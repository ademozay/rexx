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

    const response = await makePostRequest('/api/v1/auth/register', {
      email: 'john.doe@rexx.com',
      password: 'password',
      passwordConfirmation: 'password',
      age: 20,
    });

    expect(response.ok).toBeTruthy();
  });

  it('should return 400 when the password is invalid', async () => {
    const { makePostRequest } = setup;

    const response = await makePostRequest('/api/v1/auth/register', {
      email: 'john.doe@rexx.com',
      password: 'rexx',
      passwordConfirmation: 'rexx',
      age: 20,
    });

    expect(response.status).toBe(400);
    expect(response.getError()).toEqual({
      message: 'Invalid password. Password must be at least 8 characters long',
    });
  });

  it('should return 409 when the email is already in use', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });

    const response = await makePostRequest('/api/v1/auth/register', {
      email: user.email.value,
      password: 'anotherPassword',
      passwordConfirmation: 'anotherPassword',
      age: 20,
    });

    expect(response.status).toBe(409);
    expect(response.getError()).toEqual({
      message: `Email is already in use: ${user.email.value}`,
    });
  });
});
