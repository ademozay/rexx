import { Collection, MongoClient } from 'mongodb';
import { from } from 'uuid-mongodb';
import { Movie } from '../../domain/movie/entity/movie';
import { MoviePort } from '../../domain/movie/port/moviePort';
import { PersistedMovie } from './entity/persistedMovie';

export class MongodbMovieAdapter implements MoviePort {
  private readonly movieCollection: Collection<PersistedMovie>;

  constructor(mongoClient: MongoClient) {
    this.movieCollection = mongoClient.db('rexx').collection('movie');
  }

  async createMovie(movie: Movie): Promise<Movie> {
    await this.movieCollection.insertOne({
      _id: from(movie.id),
      name: movie.name.value,
      ageRestriction: movie.ageRestriction,
    });

    return movie;
  }

  async updateMovie(movie: Movie): Promise<Movie> {
    await this.movieCollection.updateOne(
      { _id: from(movie.id) },
      { $set: { name: movie.name.value, ageRestriction: movie.ageRestriction } },
    );

    return movie;
  }

  async deleteMovie(movieId: string): Promise<void> {
    await this.movieCollection.deleteOne({ _id: from(movieId) });
  }

  async findMovieById(id: string): Promise<Movie | undefined> {
    const movie = await this.movieCollection.findOne({ _id: from(id) });
    if (!movie) {
      return undefined;
    }

    return Movie.hydrate(
      {
        name: movie.name,
        ageRestriction: movie.ageRestriction,
      },
      movie._id.toString(),
    );
  }

  async findAllMovies(): Promise<Movie[]> {
    const movies = await this.movieCollection.find().toArray();

    return movies.map((movie) =>
      Movie.hydrate(
        {
          name: movie.name,
          ageRestriction: movie.ageRestriction,
        },
        movie._id.toString(),
      ),
    );
  }
}
