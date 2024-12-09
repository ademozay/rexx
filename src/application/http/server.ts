import cors from 'cors';
import express, { ErrorRequestHandler, Express } from 'express';
import helmet from 'helmet';
import http from 'http';
import { BaseContext } from '../../context';
import { logger } from '../../logger';
import { createHttpContextMiddlewareCreator } from './context';
import { AuthController } from './controller/authController';
import { MovieController } from './controller/movieController';
import { SessionController } from './controller/sessionController';

export type Controllers = {
  authController: AuthController;
  movieController: MovieController;
  sessionController: SessionController;
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
    this.registerHealthCheck();
    this.registerErrorMiddleware();

    const { authController, movieController, sessionController } = this.controllers;

    this.app.get('/', (_, response) => {
      response.send('OK');
    });

    this.app.use(createHttpContextMiddlewareCreator(this.baseContext));

    this.app.post('/api/v1/auth/register', authController.registerCustomer.bind(authController));
    this.app.post(
      '/api/v1/auth/register-manager',
      authController.registerManager.bind(authController),
    );
    this.app.post('/api/v1/auth/sign-in', authController.signIn.bind(authController));

    this.app.post('/api/v1/movies', movieController.createMovie.bind(movieController));
    this.app.get('/api/v1/movies', movieController.listMovies.bind(movieController));
    this.app.put('/api/v1/movies/:id', movieController.updateMovie.bind(movieController));
    this.app.delete('/api/v1/movies/:id', movieController.deleteMovie.bind(movieController));

    this.app.post('/api/v1/sessions', sessionController.createSession.bind(sessionController));
    this.app.put('/api/v1/sessions/:id', sessionController.updateSession.bind(sessionController));
    this.app.delete(
      '/api/v1/sessions/:id',
      sessionController.deleteSession.bind(sessionController),
    );
    this.app.post(
      '/api/v1/sessions/:id/tickets',
      sessionController.buyTicket.bind(sessionController),
    );
    this.app.get('/api/v1/watch/:ticketId', sessionController.watchMovie.bind(sessionController));
  }

  private registerHealthCheck(): void {
    this.app.get('/health', (_, response) => {
      response.send('OK');
    });
  }

  private registerErrorMiddleware(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
      logger.error('🔥 unhandled error:', error);

      response.status(500).send({
        error: 'Internal server error',
      });
    };

    this.app.use(errorMiddleware);
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
