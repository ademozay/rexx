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

describe('buy ticket', () => {
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

  it('should buy a ticket for a session', async () => {
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
    const session = await createMockSession(moviePort, {
      movieId: movie.id,
      sessionDate: sessionDate.value,
      timeSlotLabel: TimeSlotLabel.Morning,
      roomNumber: 1,
    });

    // act
    const response = await makePostRequest('/api/v1/tickets', { sessionId: session.id }, token);

    // assert
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ id: expect.any(String) });
  });

  it('should return 404 if the session is not found', async () => {
    const {
      makePostRequest,
      ports: { userPort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);
    const sessionId = randomUUID();

    // act
    const response = await makePostRequest('/api/v1/tickets', { sessionId }, token);

    // assert
    expect(response.status).toBe(404);
  });

  it('should return 400 when the user is too young', async () => {
    const {
      makePostRequest,
      ports: { userPort, moviePort },
    } = setup;

    // arrange
    const user = await createMockUser(userPort, { age: 13, role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Dabbe',
      ageRestriction: AgeRestriction.NC_17,
    });

    const sessionDate = createSessionDate();
    const session = await createMockSession(moviePort, {
      movieId: movie.id,
      sessionDate: sessionDate.value,
      timeSlotLabel: TimeSlotLabel.Morning,
      roomNumber: 1,
    });

    // act
    const response = await makePostRequest('/api/v1/tickets', { sessionId: session.id }, token);

    // assert
    expect(response.status).toBe(400);
    expect(response.error).toEqual({
      message: `User is too young to watch this movie: ${user.id}, age restriction: ${movie.ageRestriction}`,
    });
  });

  it('should return 400 if the session is already started', async () => {
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

    const sessionDate = createSessionDate(-1);
    const session = await createMockSession(moviePort, {
      movieId: movie.id,
      sessionDate: sessionDate.value,
      timeSlotLabel: TimeSlotLabel.Morning,
      roomNumber: 1,
    });

    // act
    const response = await makePostRequest('/api/v1/tickets', { sessionId: session.id }, token);

    // assert
    expect(response.status).toBe(400);
    expect(response.error).toEqual({ message: `Session already started: ${session.id}` });
  });
});
