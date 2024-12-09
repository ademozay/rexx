import assert from 'assert';
import http from 'http';
import request from 'supertest';
import { Server } from '../src/application/http/server';
import { CompositionRoot, Ports } from '../src/compositionRoot';
import { IntegrationTestSetupOptions, createIntegrationTestSetup } from './integration';

export type ResponseHandler<ResponseType> = {
  ok: boolean;
  status: number;
  getData(): ResponseType;
  getError(): { message: string };
};

export type HttpTestSetup = {
  server: http.Server;
  ports: Ports;
  makeGetRequest<ResponseType>(
    path: string,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>>;
  makePostRequest<ResponseType>(
    path: string,
    body: Record<string, unknown>,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>>;
  makePutRequest<ResponseType>(
    path: string,
    body: Record<string, unknown>,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>>;
  makeDeleteRequest<ResponseType>(
    path: string,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>>;
  resetState: () => Promise<void>;
  teardown: () => Promise<void>;
};

export async function createHttpTestSetup(
  integrationTestSetupOptions: IntegrationTestSetupOptions = {},
): Promise<HttpTestSetup> {
  const { ports, resetState, teardown } = await createIntegrationTestSetup(
    integrationTestSetupOptions,
  );

  const { baseContext, controllers } = CompositionRoot.getInstance();

  const server = Server.create(baseContext, controllers, 0);
  server.bootstrap();
  const httpServer = await server.start();

  function createResponseHandlers<ResponseType>(response: request.Response) {
    return {
      ok: response.ok,
      status: response.status,
      getData(): ResponseType {
        return response.body.data;
      },

      getError(): { message: string } {
        assert(response.body.error);
        return { message: response.body.error };
      },
    };
  }

  async function makeGetRequest<ResponseType>(
    path: string,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>> {
    const agent = request.agent(httpServer);
    const response = await agent.get(path).set('Authorization', `Bearer ${token}`).send();
    return createResponseHandlers<ResponseType>(response);
  }

  async function makePostRequest<ResponseType>(
    path: string,
    body: Record<string, unknown>,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>> {
    const agent = request.agent(httpServer);
    const response = await agent.post(path).set('Authorization', `Bearer ${token}`).send(body);
    return createResponseHandlers<ResponseType>(response);
  }

  async function makePutRequest<ResponseType>(
    path: string,
    body: Record<string, unknown>,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>> {
    const agent = request.agent(httpServer);
    const response = await agent.put(path).set('Authorization', `Bearer ${token}`).send(body);
    return createResponseHandlers<ResponseType>(response);
  }

  async function makeDeleteRequest<ResponseType>(
    path: string,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>> {
    const agent = request.agent(httpServer);
    const response = await agent.delete(path).set('Authorization', `Bearer ${token}`).send();
    return createResponseHandlers<ResponseType>(response);
  }

  return {
    server: httpServer,
    ports,
    makeGetRequest,
    makePostRequest,
    makePutRequest,
    makeDeleteRequest,
    resetState: async () => {
      await resetState();
    },
    async teardown() {
      await teardown();
      httpServer.close();
    },
  };
}
