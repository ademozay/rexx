export enum InjectionToken {
  BaseContext = 'BaseContext',

  RegisterManagerUseCaseHandler = 'RegisterManagerUseCaseHandler',
  RegisterCustomerUseCaseHandler = 'RegisterCustomerUseCaseHandler',
  SignInUseCaseHandler = 'SignInUseCaseHandler',
  FindActorByTokenUseCaseHandler = 'FindActorByTokenUseCaseHandler',

  CreateMovieUseCaseHandler = 'CreateMovieUseCaseHandler',
  UpdateMovieUseCaseHandler = 'UpdateMovieUseCaseHandler',
  DeleteMovieUseCaseHandler = 'DeleteMovieUseCaseHandler',
  ListMoviesUseCaseHandler = 'ListMoviesUseCaseHandler',

  CreateSessionUseCaseHandler = 'CreateSessionUseCaseHandler',
  UpdateSessionUseCaseHandler = 'UpdateSessionUseCaseHandler',
  DeleteSessionUseCaseHandler = 'DeleteSessionUseCaseHandler',
  BuyTicketUseCaseHandler = 'BuyTicketUseCaseHandler',
  FindMovieSessionsUseCaseHandler = 'FindMovieSessionsUseCaseHandler',
  WatchMovieUseCaseHandler = 'WatchMovieUseCaseHandler',
  GetWatchHistoryUseCaseHandler = 'GetWatchHistoryUseCaseHandler',

  MoviePort = 'MoviePort',
  SessionPort = 'SessionPort',
  UserPort = 'UserPort',

  MovieService = 'MovieService',
  UserService = 'UserService',

  AuthController = 'AuthController',
  MovieController = 'MovieController',
  SessionController = 'SessionController',
}
