import { randomUUID } from 'crypto';
import { AgeRestriction } from '../../../src/domain/movie/entity/ageRestriction';
import { TimeSlotLabel } from '../../../src/domain/session/valueObjects/timeSlot';
import { UserRole } from '../../../src/domain/user/entity/userRole';
import { createMockMovie } from '../../helper/createMockMovie';
import { createMockSession } from '../../helper/createMockSession';
import { createMockUser } from '../../helper/createMockUser';
import { createSessionDate } from '../../helper/createSessionDate';
import { signIn } from '../../helper/signIn';
import { HttpTestSetup, createHttpTestSetup } from '../../http';

describe('create session', () => {
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

  it('should create a session', async () => {
    const {
      makePostRequest,
      ports: { userPort, moviePort },
    } = setup;

    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Truman Show',
      ageRestriction: AgeRestriction.PG_7,
    });

    const sessionDate = createSessionDate();

    const response = await makePostRequest(
      `/api/v1/sessions`,
      {
        movieId: movie.id,
        sessionDate: sessionDate.value,
        timeSlotLabel: TimeSlotLabel.Morning,
        roomNumber: 1,
      },
      token,
    );

    const data = response.getData();

    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(201);
    expect(data).toEqual({
      id: expect.any(String),
      movieId: movie.id,
      sessionDate: sessionDate.value,
      timeSlotLabel: TimeSlotLabel.Morning,
      roomNumber: 1,
    });
  });

  it('should return 400 when session date is in the past', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const sessionDate = createSessionDate(-1);

    const response = await makePostRequest(
      '/api/v1/sessions',
      {
        movieId: randomUUID(),
        sessionDate: sessionDate.value,
        timeSlotLabel: TimeSlotLabel.Morning,
        roomNumber: 1,
      },
      token,
    );

    const error = response.getError();

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(400);
    expect(error).toEqual({
      message: 'Session date cannot be in the past',
    });
  });

  it('should return 400 when session already exists', async () => {
    const {
      makePostRequest,
      ports: { userPort, moviePort, sessionPort },
    } = setup;

    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Truman Show',
      ageRestriction: AgeRestriction.PG_7,
    });

    const sessionDate = createSessionDate();
    const session = await createMockSession(sessionPort, {
      movieId: movie.id,
      sessionDate: sessionDate.value,
      timeSlotLabel: TimeSlotLabel.Morning,
      roomNumber: 1,
    });

    const response = await makePostRequest(
      '/api/v1/sessions',
      {
        movieId: movie.id,
        sessionDate: session.sessionDate.value,
        timeSlotLabel: TimeSlotLabel.Morning,
        roomNumber: 1,
      },
      token,
    );

    const error = response.getError();

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(400);
    expect(error).toEqual({
      message: 'Session already exists',
    });
  });

  it('should return 401 when actor is not found', async () => {
    const { makePostRequest } = setup;

    const response = await makePostRequest('/api/v1/sessions', {
      movieId: randomUUID(),
      sessionDate: '2024-08-22',
      timeSlotLabel: TimeSlotLabel.Morning,
      roomNumber: 1,
    });

    const error = response.getError();

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(401);
    expect(error).toEqual({
      message: 'Unauthorized',
    });
  });

  it('should return 403 when actor is not a manager', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);

    const sessionDate = createSessionDate();

    const response = await makePostRequest(
      '/api/v1/sessions',
      {
        movieId: randomUUID(),
        sessionDate: sessionDate.value,
        timeSlotLabel: TimeSlotLabel.Morning,
        roomNumber: 1,
      },
      token,
    );

    const error = response.getError();

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(403);
    expect(error).toEqual({
      message: 'Only managers can create sessions',
    });
  });
});
