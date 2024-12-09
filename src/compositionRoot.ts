import { Container } from 'inversify';
import { AuthController } from './application/http/controller/authController';
import { MovieController } from './application/http/controller/movieController';
import { SessionController } from './application/http/controller/sessionController';
import { Controllers } from './application/http/server';
import { BaseContext, makeBaseContext } from './context';
import { CreateMovieUseCaseHandler } from './domain/movie/createMovieUseCaseHandler';
import { DeleteMovieUseCaseHandler } from './domain/movie/deleteMovieUseCaseHandler';
import { ListMoviesUseCaseHandler } from './domain/movie/listMoviesUseCaseHandler';
import { MoviePort } from './domain/movie/port/moviePort';
import { MovieService } from './domain/movie/service/movieService';
import { UpdateMovieUseCaseHandler } from './domain/movie/updateMovieUseCaseHandler';
import { BuyTicketUseCaseHandler } from './domain/session/buyTicketUseCaseHandler';
import { CreateSessionUseCaseHandler } from './domain/session/createSessionUseCaseHandler';
import { DeleteSessionUseCaseHandler } from './domain/session/deleteSessionUseCaseHandler';
import { FindMovieSessionsUseCaseHandler } from './domain/session/findMovieSessionsUseCaseHandler';
import { SessionPort } from './domain/session/port/sessionPort';
import { UpdateSessionUseCaseHandler } from './domain/session/updateSessionUseCaseHandler';
import { WatchMovieUseCaseHandler } from './domain/session/watchMovieUseCaseHandler';
import { FindActorByTokenUseCaseHandler } from './domain/user/findUserByTokenUseCaseHandler';
import { GetWatchHistoryUseCaseHandler } from './domain/user/getWatchHistoryUseCaseHandler';
import { UserPort } from './domain/user/port/userPort';
import { RegisterCustomerUseCaseHandler } from './domain/user/registerCustomerUseCaseHandler';
import { RegisterManagerUseCaseHandler } from './domain/user/registerManagerUseCaseHandler';
import { UserService } from './domain/user/service/userService';
import { SignInUseCaseHandler } from './domain/user/signInUseCaseHandler';
import { createMongoClient } from './infra/mongodb/createMongoClient';
import { MongodbMovieAdapter } from './infra/movie/mongodbMovieAdapter';
import { MongodbSessionAdapter } from './infra/session/mongodbSessionAdapter';
import { MongodbUserAdapter } from './infra/user/mongodbUserAdapter';
import { InjectionToken } from './injectionToken';

export type Ports = {
  moviePort: MoviePort;
  sessionPort: SessionPort;
  userPort: UserPort;
};

export class CompositionRoot {
  private static readonly instance: CompositionRoot = new CompositionRoot();

  private readonly container: Container = new Container();

  private constructor() {}

  static getInstance(): CompositionRoot {
    return CompositionRoot.instance;
  }

  get baseContext(): BaseContext {
    return this.container.get<BaseContext>(InjectionToken.BaseContext);
  }

  get controllers(): Controllers {
    return {
      authController: this.container.get<AuthController>(InjectionToken.AuthController),
      movieController: this.container.get<MovieController>(InjectionToken.MovieController),
      sessionController: this.container.get<SessionController>(InjectionToken.SessionController),
    };
  }

  async bind(): Promise<void> {
    if (this.container.isBound(InjectionToken.BaseContext)) {
      throw new Error('Composition root is already bound');
    }

    const mongoClient = await createMongoClient();

    const mongodbMovieAdapter = new MongodbMovieAdapter(mongoClient);
    const mongodbSessionAdapter = new MongodbSessionAdapter(mongoClient);
    await mongodbSessionAdapter.createIndexes();
    const mongodbUserAdapter = new MongodbUserAdapter(mongoClient);
    await mongodbUserAdapter.createIndexes();
    await mongodbUserAdapter.createRootUser();

    this.bindPorts({
      moviePort: mongodbMovieAdapter,
      sessionPort: mongodbSessionAdapter,
      userPort: mongodbUserAdapter,
    });
    this.bindServices();
    this.bindUseCaseHandlers();
    this.bindControllers();
    this.bindBaseContext();

    this.verify();
  }

  bindPorts(ports: Ports): void {
    this.container.bind<MoviePort>(InjectionToken.MoviePort).toConstantValue(ports.moviePort);
    this.container.bind<SessionPort>(InjectionToken.SessionPort).toConstantValue(ports.sessionPort);
    this.container.bind<UserPort>(InjectionToken.UserPort).toConstantValue(ports.userPort);
  }

  bindServices(): void {
    this.container
      .bind<MovieService>(InjectionToken.MovieService)
      .to(MovieService)
      .inSingletonScope();
    this.container.bind<UserService>(InjectionToken.UserService).to(UserService).inSingletonScope();
  }

  bindControllers(): void {
    this.container
      .bind<AuthController>(InjectionToken.AuthController)
      .to(AuthController)
      .inSingletonScope();
    this.container
      .bind<MovieController>(InjectionToken.MovieController)
      .to(MovieController)
      .inSingletonScope();
    this.container
      .bind<SessionController>(InjectionToken.SessionController)
      .to(SessionController)
      .inSingletonScope();
  }

  bindUseCaseHandlers(): void {
    this.container
      .bind<RegisterManagerUseCaseHandler>(InjectionToken.RegisterManagerUseCaseHandler)
      .to(RegisterManagerUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<RegisterCustomerUseCaseHandler>(InjectionToken.RegisterCustomerUseCaseHandler)
      .to(RegisterCustomerUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<FindActorByTokenUseCaseHandler>(InjectionToken.FindActorByTokenUseCaseHandler)
      .to(FindActorByTokenUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<SignInUseCaseHandler>(InjectionToken.SignInUseCaseHandler)
      .to(SignInUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<CreateMovieUseCaseHandler>(InjectionToken.CreateMovieUseCaseHandler)
      .to(CreateMovieUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<UpdateMovieUseCaseHandler>(InjectionToken.UpdateMovieUseCaseHandler)
      .to(UpdateMovieUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<DeleteMovieUseCaseHandler>(InjectionToken.DeleteMovieUseCaseHandler)
      .to(DeleteMovieUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<ListMoviesUseCaseHandler>(InjectionToken.ListMoviesUseCaseHandler)
      .to(ListMoviesUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<CreateSessionUseCaseHandler>(InjectionToken.CreateSessionUseCaseHandler)
      .to(CreateSessionUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<UpdateSessionUseCaseHandler>(InjectionToken.UpdateSessionUseCaseHandler)
      .to(UpdateSessionUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<DeleteSessionUseCaseHandler>(InjectionToken.DeleteSessionUseCaseHandler)
      .to(DeleteSessionUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<BuyTicketUseCaseHandler>(InjectionToken.BuyTicketUseCaseHandler)
      .to(BuyTicketUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<FindMovieSessionsUseCaseHandler>(InjectionToken.FindMovieSessionsUseCaseHandler)
      .to(FindMovieSessionsUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<WatchMovieUseCaseHandler>(InjectionToken.WatchMovieUseCaseHandler)
      .to(WatchMovieUseCaseHandler)
      .inSingletonScope();
    this.container
      .bind<GetWatchHistoryUseCaseHandler>(InjectionToken.GetWatchHistoryUseCaseHandler)
      .to(GetWatchHistoryUseCaseHandler)
      .inSingletonScope();
  }

  bindBaseContext(): void {
    this.container
      .bind<BaseContext>(InjectionToken.BaseContext)
      .toConstantValue(makeBaseContext(this.container));
  }

  private verify(): void {
    const missingTokens: string[] = Object.values(InjectionToken).filter(
      (token) => !this.container.isBound(token),
    );

    if (missingTokens.length > 0) {
      throw new Error(
        `Following tokens are not registered in composition root: ${missingTokens.join(', ')}`,
      );
    }
  }
}
