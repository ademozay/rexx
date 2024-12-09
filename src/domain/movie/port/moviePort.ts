import { Movie } from '../entity/movie';

export interface MoviePort {
  createMovie(movie: Movie): Promise<Movie>;
  updateMovie(movie: Movie): Promise<Movie>;
  deleteMovie(movieId: string): Promise<void>;
  findMovieById(id: string): Promise<Movie | undefined>;
  findAllMovies(): Promise<Movie[]>;
}
