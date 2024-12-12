import { randomUUID } from 'crypto';
import { AgeRestriction } from '../../../src/domain/movie/entity/ageRestriction';
import { TimeSlotLabel } from '../../../src/domain/movie/valueObjects/timeSlot';
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

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Truman Show',
      ageRestriction: AgeRestriction.PG_7,
    });
    const sessionDate = createSessionDate();

    // act
    const response = await makePostRequest(
      `/api/v1/movies/${movie.id}/sessions`,
      {
        sessionDate: sessionDate.value,
        timeSlotLabel: TimeSlotLabel.Morning,
        roomNumber: 1,
      },
      token,
    );

    // assert
    expect(response.status).toBe(201);
    expect(response.data).toEqual({
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
      ports: { userPort, moviePort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Truman Show',
      ageRestriction: AgeRestriction.PG_7,
    });
    const sessionDate = createSessionDate(-1);

    // act
    const response = await makePostRequest(
      `/api/v1/movies/${movie.id}/sessions`,
      {
        sessionDate: sessionDate.value,
        timeSlotLabel: TimeSlotLabel.Morning,
        roomNumber: 1,
      },
      token,
    );

    // assert
    expect(response.status).toBe(400);
    expect(response.error).toEqual({ message: 'Session date cannot be in the past' });
  });

  it('should return 400 when session already exists', async () => {
    const {
      makePostRequest,
      ports: { userPort, moviePort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Truman Show',
      ageRestriction: AgeRestriction.PG_7,
    });

    const sessionDate = createSessionDate();
    const session = await createMockSession(moviePort, {
      movieId: movie.id,
      sessionDate: sessionDate.value,
      timeSlotLabel: TimeSlotLabel.Morning,
      roomNumber: 1,
    });

    // act
    const response = await makePostRequest(
      `/api/v1/movies/${movie.id}/sessions`,
      {
        sessionDate: session.sessionDate.value,
        timeSlotLabel: TimeSlotLabel.Morning,
        roomNumber: 1,
      },
      token,
    );

    // assert
    expect(response.status).toBe(400);
    expect(response.error).toEqual({ message: 'Session already exists' });
  });

  it('should return 401 when actor is not found', async () => {
    const {
      makePostRequest,
      ports: { moviePort },
    } = setup;

    // arrange
    const movie = await createMockMovie(moviePort, {
      name: 'Truman Show',
      ageRestriction: AgeRestriction.PG_7,
    });

    // act
    const response = await makePostRequest(`/api/v1/movies/${movie.id}/sessions`, {
      sessionDate: '2024-08-22',
      timeSlotLabel: TimeSlotLabel.Morning,
      roomNumber: 1,
    });

    // assert
    expect(response.status).toBe(401);
    expect(response.error).toEqual({ message: 'Unauthorized' });
  });

  it('should return 403 when actor is not a manager', async () => {
    const {
      makePostRequest,
      ports: { userPort, moviePort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Truman Show',
      ageRestriction: AgeRestriction.PG_7,
    });
    const sessionDate = createSessionDate();

    // act
    const response = await makePostRequest(
      `/api/v1/movies/${movie.id}/sessions`,
      {
        sessionDate: sessionDate.value,
        timeSlotLabel: TimeSlotLabel.Morning,
        roomNumber: 1,
      },
      token,
    );

    // assert
    expect(response.status).toBe(403);
    expect(response.error).toEqual({ message: 'Only managers can create sessions' });
  });

  it('should return 404 when movie is not found', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.MANAGER });
    const token = await signIn(userPort, user);

    const movieId = randomUUID();

    // act
    const response = await makePostRequest(
      `/api/v1/movies/${movieId}/sessions`,
      {
        sessionDate: '2024-08-22',
        timeSlotLabel: TimeSlotLabel.Morning,
        roomNumber: 1,
      },
      token,
    );

    // assert
    expect(response.status).toBe(404);
    expect(response.error).toEqual({ message: `Movie not found: ${movieId}` });
  });
});
