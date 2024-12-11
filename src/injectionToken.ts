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
  WatchMovieUseCaseHandler = 'WatchMovieUseCaseHandler',
  GetWatchHistoryUseCaseHandler = 'GetWatchHistoryUseCaseHandler',

  UserPort = 'UserPort',
  MoviePort = 'MoviePort',
  TicketPort = 'TicketPort',

  UserService = 'UserService',
  MovieService = 'MovieService',
  TicketService = 'TicketService',

  AuthController = 'AuthController',
  MovieController = 'MovieController',
  SessionController = 'SessionController',
}
