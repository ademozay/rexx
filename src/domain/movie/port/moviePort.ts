import { Movie } from '../entity/movie';
import { Session } from '../entity/session';

export interface MoviePort {
  createMovie(movie: Movie): Promise<Movie>;
  updateMovie(movie: Movie): Promise<Movie>;
  deleteMovie(movieId: string): Promise<void>;
  findMovieById(id: string): Promise<Movie | undefined>;
  findAllMovies(): Promise<Movie[]>;

  createSession(session: Session): Promise<Session>;
  updateSession(session: Session): Promise<Session>;
  deleteSession(sessionId: string): Promise<void>;
  sessionExists(session: Session): Promise<boolean>;
  findSessionById(sessionId: string): Promise<Session | undefined>;
  findSessionsByMovieIds(movieIds: string[]): Promise<Session[]>;
}
