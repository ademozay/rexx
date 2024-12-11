import { Collection, MongoClient } from 'mongodb';
import { from } from 'uuid-mongodb';
import { Movie } from '../../domain/movie/entity/movie';
import { Session } from '../../domain/movie/entity/session';
import { MoviePort } from '../../domain/movie/port/moviePort';
import { PersistedSession } from '../session/entity/persistedSession';
import { PersistedMovie } from './entity/persistedMovie';
import { PersistedMovieMapper } from './mapper/persistedMovieMapper';
import { PersistedSessionMapper } from './mapper/persistedSessionMapper';

export class MongodbMovieAdapter implements MoviePort {
  private readonly movieCollection: Collection<PersistedMovie>;

  private readonly sessionCollection: Collection<PersistedSession>;

  constructor(mongoClient: MongoClient, databaseName: string) {
    this.movieCollection = mongoClient.db(databaseName).collection('movie');
    this.sessionCollection = mongoClient.db(databaseName).collection('session');
  }

  async createIndexes(): Promise<void> {
    await this.sessionCollection.createIndex(
      {
        movieId: 1,
        sessionDate: 1,
        timeSlotLabel: 1,
      },
      { unique: true },
    );
  }

  async createMovie(movie: Movie): Promise<Movie> {
    await this.movieCollection.insertOne({
      _id: from(movie.id),
      name: movie.name.value,
      ageRestriction: movie.ageRestriction,
    });

    if (movie.sessions.length > 0) {
      await this.sessionCollection.insertMany(
        movie.sessions.map((session) => ({
          _id: from(session.id),
          movieId: from(session.movieId),
          sessionDate: session.sessionDate.value,
          timeSlotLabel: session.timeSlot.value,
          roomNumber: session.roomNumber,
        })),
      );
    }

    return movie;
  }

  async updateMovie(movie: Movie): Promise<Movie> {
    await this.movieCollection.updateOne(
      { _id: from(movie.id) },
      { $set: { name: movie.name.value, ageRestriction: movie.ageRestriction } },
    );

    if (movie.sessions.length > 0) {
      await this.sessionCollection.deleteMany({ movieId: from(movie.id) });

      await this.sessionCollection.insertMany(
        movie.sessions.map((session) => ({
          _id: from(session.id),
          movieId: from(session.movieId),
          sessionDate: session.sessionDate.value,
          timeSlotLabel: session.timeSlot.value,
          roomNumber: session.roomNumber,
        })),
      );
    }

    return movie;
  }

  async deleteMovie(movieId: string): Promise<void> {
    await this.movieCollection.deleteOne({ _id: from(movieId) });
    await this.sessionCollection.deleteMany({ movieId: from(movieId) });
  }

  async findMovieById(id: string): Promise<Movie | undefined> {
    const movie = await this.movieCollection.findOne({ _id: from(id) });
    if (!movie) {
      return undefined;
    }

    const sessions = await this.sessionCollection.find({ movieId: from(id) }).toArray();

    return PersistedMovieMapper.toDomain(movie, sessions);
  }

  async findAllMovies(): Promise<Movie[]> {
    const movies = await this.movieCollection.find().toArray();

    const movieIds = movies.map((movie) => movie._id);
    const sessions = await this.sessionCollection.find({ movieId: { $in: movieIds } }).toArray();

    const sessionsByMovieId = sessions.reduce((acc, session) => {
      const movieId = session.movieId.toString();
      const movieSessions = acc.get(movieId) ?? [];
      movieSessions.push(session);
      acc.set(movieId, movieSessions);
      return acc;
    }, new Map<string, PersistedSession[]>());

    return movies.map((movie) =>
      PersistedMovieMapper.toDomain(movie, sessionsByMovieId.get(movie._id.toString()) ?? []),
    );
  }

  async createSession(session: Session): Promise<Session> {
    await this.sessionCollection.insertOne({
      _id: from(session.id),
      movieId: from(session.movieId),
      sessionDate: session.sessionDate.value,
      timeSlotLabel: session.timeSlot.value,
      roomNumber: session.roomNumber,
    });

    return session;
  }

  async updateSession(session: Session): Promise<Session> {
    await this.sessionCollection.updateOne(
      { _id: from(session.id) },
      {
        $set: {
          movieId: from(session.movieId),
          sessionDate: session.sessionDate.value,
          timeSlotLabel: session.timeSlot.value,
          roomNumber: session.roomNumber,
        },
      },
    );

    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessionCollection.deleteOne({ _id: from(sessionId) });
  }

  async findSessionById(sessionId: string): Promise<Session | undefined> {
    const session = await this.sessionCollection.findOne({ _id: from(sessionId) });
    if (!session) {
      return undefined;
    }

    return PersistedSessionMapper.toDomain(session);
  }

  async findSessionsByMovieIds(movieIds: string[]): Promise<Session[]> {
    const sessions = await this.sessionCollection
      .find({ movieId: { $in: movieIds.map((id) => from(id)) } })
      .toArray();

    return sessions.map((session) => PersistedSessionMapper.toDomain(session));
  }

  async sessionExists(session: Session): Promise<boolean> {
    const existingSession = await this.sessionCollection.findOne({
      movieId: from(session.movieId),
      sessionDate: session.sessionDate.value,
      timeSlotLabel: session.timeSlot.value,
      roomNumber: session.roomNumber,
    });

    return !!existingSession;
  }
}
