import { AgeRestriction } from '../../../src/domain/movie/entity/ageRestriction';
import { TimeSlotLabel } from '../../../src/domain/movie/valueObjects/timeSlot';
import { UserRole } from '../../../src/domain/user/entity/userRole';
import { createMockMovie } from '../../helper/createMockMovie';
import { createMockSession } from '../../helper/createMockSession';
import { createMockUser } from '../../helper/createMockUser';
import { signIn } from '../../helper/signIn';
import { HttpTestSetup, createHttpTestSetup } from '../../http';

describe('list movies', () => {
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

  it('should list movies', async () => {
    const {
      makeGetRequest,
      ports: { userPort, moviePort },
    } = setup;

    const user = await createMockUser(userPort, { role: UserRole.CUSTOMER });
    const token = await signIn(userPort, user);

    const movie = await createMockMovie(moviePort, {
      name: 'Catch Me If You Can',
      ageRestriction: AgeRestriction.PG_13,
    });

    const session = await createMockSession(moviePort, {
      movieId: movie.id,
      sessionDate: '2024-08-22',
      timeSlotLabel: TimeSlotLabel.Morning,
      roomNumber: 1,
    });

    const response = await makeGetRequest('/api/v1/movies', token);
    const data = response.getData();

    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(200);
    expect(data).toEqual([
      {
        id: movie.id,
        name: movie.name.value,
        ageRestriction: AgeRestriction.PG_13,
        sessions: [
          {
            id: session.id,
            movieId: movie.id,
            sessionDate: '2024-08-22',
            timeSlotLabel: TimeSlotLabel.Morning,
            roomNumber: 1,
          },
        ],
      },
    ]);
  });
});
