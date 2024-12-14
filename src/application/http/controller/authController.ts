import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { InvalidCredentialsError } from '../../../domain/user/error/invalidCredentialsError';
import { InvalidPasswordError } from '../../../domain/user/error/invalidPasswordError';
import { OnlyManagersCanRegisterManagerError } from '../../../domain/user/error/onlyManagersCanRegisterManagerError';
import { UserAlreadyRegisteredError } from '../../../domain/user/error/userAlreadyRegisteredError';
import { RegisterCustomerUseCase } from '../../../domain/user/useCase/registerCustomerUseCase';
import { RegisterManagerUseCase } from '../../../domain/user/useCase/registerManagerUseCase';
import { SignInUseCase } from '../../../domain/user/useCase/signInUseCase';
import { logger } from '../../../logger';
import { RegisterCustomerBody } from '../../schema/user/registerCustomer';
import { RegisterManagerBody } from '../../schema/user/registerManager';
import { SignInBody } from '../../schema/user/signIn';
import { createErrorResponse } from '../response';

@injectable()
export class AuthController {
  async registerCustomer(
    request: Request<unknown, unknown, RegisterCustomerBody>,
    response: Response,
  ): Promise<void> {
    const { email, password, age } = request.body;

    const {
      useCases: { registerCustomerUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const useCase = new RegisterCustomerUseCase(email, password, age);
      await registerCustomerUseCaseHandler.handle(useCase);

      response.status(201).json();
    } catch (error) {
      // TODO: we should use i18n to return localized response message for each domain error
      if (error instanceof InvalidPasswordError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof UserAlreadyRegisteredError) {
        response.status(409).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error registering customer', { error });
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async registerManager(
    request: Request<unknown, unknown, RegisterManagerBody>,
    response: Response,
  ): Promise<void> {
    const { actor } = response.locals.httpContext;
    if (!actor) {
      response.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const { email, password, age } = request.body;

    const {
      useCases: { registerManagerUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const useCase = new RegisterManagerUseCase(actor, email, password, age);
      await registerManagerUseCaseHandler.handle(useCase);

      response.status(201).json();
    } catch (error) {
      // TODO: we should use i18n to return localized response message for each domain error
      if (error instanceof InvalidPasswordError) {
        response.status(400).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof OnlyManagersCanRegisterManagerError) {
        response.status(401).json(createErrorResponse(error.message));
        return;
      }

      if (error instanceof UserAlreadyRegisteredError) {
        response.status(409).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error registering manager', { error });
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }

  async signIn(request: Request<unknown, unknown, SignInBody>, response: Response): Promise<void> {
    const { email, password } = request.body;

    const {
      useCases: { signInUseCaseHandler },
    } = response.locals.httpContext;

    try {
      const useCase = new SignInUseCase(email, password);
      const { token } = await signInUseCaseHandler.handle(useCase);

      response.status(200).json({ token });
    } catch (error) {
      // TODO: we should use i18n to return localized response message for each domain error
      if (error instanceof InvalidCredentialsError) {
        response.status(401).json(createErrorResponse(error.message));
        return;
      }

      logger.error('error signing in', { error });
      response.status(500).json(createErrorResponse('Internal server error'));
    }
  }
}
