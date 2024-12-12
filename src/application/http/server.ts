import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import http from 'http';
import { BaseContext } from '../../context';
import { logger } from '../../logger';
import { createHttpContextMiddlewareCreator } from './context';
import { AuthController } from './controller/authController';
import { MovieController } from './controller/movieController';
import { TicketController } from './controller/ticketController';
import { createErrorResponse } from './response';

export type Controllers = {
  authController: AuthController;
  movieController: MovieController;
  ticketController: TicketController;
};

export class Server {
  private constructor(
    private readonly app: Express,
    private readonly baseContext: BaseContext,
    private readonly controllers: Controllers,
    private readonly httpServer: http.Server,
    private readonly httpPort: number,
  ) {}

  static create(baseContext: BaseContext, controllers: Controllers, httpPort: number): Server {
    const app = express();
    const httpServer = http.createServer(app);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(helmet());
    app.disable('x-powered-by');

    return new Server(app, baseContext, controllers, httpServer, httpPort);
  }

  bootstrap(): void {
    this.bootstrapMiddlewares();

    const v1 = express.Router();

    const auth = this.createAuthRoutes(this.controllers.authController);
    const movies = this.createMovieRoutes(this.controllers.movieController);
    const tickets = this.createTicketRoutes(this.controllers.ticketController);

    v1.use('/auth', auth);
    v1.use('/movies', movies);
    v1.use('/tickets', tickets);

    this.app.use('/api/v1', v1);
  }

  private bootstrapMiddlewares(): void {
    this.app.use(this.createErrorMiddleware());
    this.app.get('/health', this.createHealthCheckMiddleware());
    this.app.use(createHttpContextMiddlewareCreator(this.baseContext));
  }

  private createHealthCheckMiddleware(): express.RequestHandler {
    return (_, response) => {
      response.send('OK');
    };
  }

  private createErrorMiddleware(): express.ErrorRequestHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (error, _request, response, _next) => {
      logger.error('🔥 http error:', error);

      response.status(500).send(createErrorResponse('Internal server error'));
    };
  }

  private createAuthRoutes(authController: AuthController): express.Router {
    const auth = express.Router();

    auth.post('/register/customer', authController.registerCustomer.bind(authController));
    auth.post('/register/manager', authController.registerManager.bind(authController));
    auth.post('/sign-in', authController.signIn.bind(authController));

    return auth;
  }

  private createMovieRoutes(movieController: MovieController): express.Router {
    const movies = express.Router();

    movies.post('/', movieController.createMovie.bind(movieController));
    movies.put('/:id', movieController.updateMovie.bind(movieController));
    movies.delete('/:id', movieController.deleteMovie.bind(movieController));
    movies.get('/', movieController.listMovies.bind(movieController));

    movies.post('/:movieId/sessions', movieController.createSession.bind(movieController));
    movies.put(
      '/:movieId/sessions/:sessionId',
      movieController.updateSession.bind(movieController),
    );
    movies.delete(
      '/:movieId/sessions/:sessionId',
      movieController.deleteSession.bind(movieController),
    );

    movies.get('/watch/:ticketId', movieController.watchMovie.bind(movieController));

    return movies;
  }

  private createTicketRoutes(ticketController: TicketController): express.Router {
    const tickets = express.Router();

    tickets.post('/', ticketController.buyTicket.bind(ticketController));

    return tickets;
  }

  async start(): Promise<http.Server> {
    this.httpServer.listen(this.httpPort, () => {
      logger.info(`🚀 rexx API is running on port ${this.httpPort}`);
    });

    process.on('SIGTERM', () => {
      this.httpServer.close(() => {
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      this.httpServer.close(() => {
        process.exit(0);
      });
    });

    return this.httpServer;
  }
}
