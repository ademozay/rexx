import { Container } from 'inversify';
import { CreateMovieUseCaseHandler } from './domain/movie/createMovieUseCaseHandler';
import { DeleteMovieUseCaseHandler } from './domain/movie/deleteMovieUseCaseHandler';
import { ListMoviesUseCaseHandler } from './domain/movie/listMoviesUseCaseHandler';
import { UpdateMovieUseCaseHandler } from './domain/movie/updateMovieUseCaseHandler';
import { BuyTicketUseCaseHandler } from './domain/session/buyTicketUseCaseHandler';
import { CreateSessionUseCaseHandler } from './domain/session/createSessionUseCaseHandler';
import { DeleteSessionUseCaseHandler } from './domain/session/deleteSessionUseCaseHandler';
import { FindMovieSessionsUseCaseHandler } from './domain/session/findMovieSessionsUseCaseHandler';
import { UpdateSessionUseCaseHandler } from './domain/session/updateSessionUseCaseHandler';
import { WatchMovieUseCaseHandler } from './domain/session/watchMovieUseCaseHandler';
import { FindActorByTokenUseCaseHandler } from './domain/user/findUserByTokenUseCaseHandler';
import { GetWatchHistoryUseCaseHandler } from './domain/user/getWatchHistoryUseCaseHandler';
import { RegisterCustomerUseCaseHandler } from './domain/user/registerCustomerUseCaseHandler';
import { RegisterManagerUseCaseHandler } from './domain/user/registerManagerUseCaseHandler';
import { SignInUseCaseHandler } from './domain/user/signInUseCaseHandler';
import { InjectionToken } from './injectionToken';

export interface BaseContext {
  useCases: {
    registerManagerUseCaseHandler: RegisterManagerUseCaseHandler;
    registerCustomerUseCaseHandler: RegisterCustomerUseCaseHandler;
    signInUseCaseHandler: SignInUseCaseHandler;
    findActorByTokenUseCaseHandler: FindActorByTokenUseCaseHandler;
    createMovieUseCaseHandler: CreateMovieUseCaseHandler;
    updateMovieUseCaseHandler: UpdateMovieUseCaseHandler;
    deleteMovieUseCaseHandler: DeleteMovieUseCaseHandler;
    listMoviesUseCaseHandler: ListMoviesUseCaseHandler;
    createSessionUseCaseHandler: CreateSessionUseCaseHandler;
    deleteSessionUseCaseHandler: DeleteSessionUseCaseHandler;
    updateSessionUseCaseHandler: UpdateSessionUseCaseHandler;
    buyTicketUseCaseHandler: BuyTicketUseCaseHandler;
    findMovieSessionsUseCaseHandler: FindMovieSessionsUseCaseHandler;
    watchMovieUseCaseHandler: WatchMovieUseCaseHandler;
    getWatchHistoryUseCaseHandler: GetWatchHistoryUseCaseHandler;
  };
}

export function makeBaseContext(container: Container): BaseContext {
  return {
    useCases: {
      registerManagerUseCaseHandler: container.get<RegisterManagerUseCaseHandler>(
        InjectionToken.RegisterManagerUseCaseHandler,
      ),
      registerCustomerUseCaseHandler: container.get<RegisterCustomerUseCaseHandler>(
        InjectionToken.RegisterCustomerUseCaseHandler,
      ),
      signInUseCaseHandler: container.get<SignInUseCaseHandler>(
        InjectionToken.SignInUseCaseHandler,
      ),
      findActorByTokenUseCaseHandler: container.get<FindActorByTokenUseCaseHandler>(
        InjectionToken.FindActorByTokenUseCaseHandler,
      ),
      createMovieUseCaseHandler: container.get<CreateMovieUseCaseHandler>(
        InjectionToken.CreateMovieUseCaseHandler,
      ),
      updateMovieUseCaseHandler: container.get<UpdateMovieUseCaseHandler>(
        InjectionToken.UpdateMovieUseCaseHandler,
      ),
      deleteMovieUseCaseHandler: container.get<DeleteMovieUseCaseHandler>(
        InjectionToken.DeleteMovieUseCaseHandler,
      ),
      listMoviesUseCaseHandler: container.get<ListMoviesUseCaseHandler>(
        InjectionToken.ListMoviesUseCaseHandler,
      ),
      createSessionUseCaseHandler: container.get<CreateSessionUseCaseHandler>(
        InjectionToken.CreateSessionUseCaseHandler,
      ),
      updateSessionUseCaseHandler: container.get<UpdateSessionUseCaseHandler>(
        InjectionToken.UpdateSessionUseCaseHandler,
      ),
      deleteSessionUseCaseHandler: container.get<DeleteSessionUseCaseHandler>(
        InjectionToken.DeleteSessionUseCaseHandler,
      ),
      buyTicketUseCaseHandler: container.get<BuyTicketUseCaseHandler>(
        InjectionToken.BuyTicketUseCaseHandler,
      ),
      findMovieSessionsUseCaseHandler: container.get<FindMovieSessionsUseCaseHandler>(
        InjectionToken.FindMovieSessionsUseCaseHandler,
      ),
      watchMovieUseCaseHandler: container.get<WatchMovieUseCaseHandler>(
        InjectionToken.WatchMovieUseCaseHandler,
      ),
      getWatchHistoryUseCaseHandler: container.get<GetWatchHistoryUseCaseHandler>(
        InjectionToken.GetWatchHistoryUseCaseHandler,
      ),
    },
  };
}
