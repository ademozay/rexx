import assert from 'assert';
import request, { Agent } from 'supertest';
import { Server } from '../src/application/http/server';
import { CompositionRoot, Ports } from '../src/compositionRoot';
import { IntegrationTestSetupOptions, createIntegrationTestSetup } from './integration';

type ResponseHandler<ResponseType> = {
  status: number;
  data: ResponseType;
  error: { message: string };
};

export type HttpTestSetup = {
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

  function createTestAgent(token?: string): Agent {
    const agent = request.agent(httpServer);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return agent.set(headers);
  }

  function createResponseHandler<ResponseType>(response: request.Response) {
    return {
      ok: response.ok,
      status: response.status,
      get data(): ResponseType {
        assert(response.body.data);
        return response.body.data;
      },
      get error(): { message: string } {
        assert(response.body.error);
        return { message: response.body.error };
      },
    };
  }

  async function makeGetRequest<ResponseType>(
    path: string,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>> {
    const agent = createTestAgent(token);
    const response = await agent.get(path).send();
    return createResponseHandler<ResponseType>(response);
  }

  async function makePostRequest<ResponseType>(
    path: string,
    body: Record<string, unknown>,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>> {
    const agent = createTestAgent(token);
    const response = await agent.post(path).send(body);
    return createResponseHandler<ResponseType>(response);
  }

  async function makePutRequest<ResponseType>(
    path: string,
    body: Record<string, unknown>,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>> {
    const agent = createTestAgent(token);
    const response = await agent.put(path).send(body);
    return createResponseHandler<ResponseType>(response);
  }

  async function makeDeleteRequest<ResponseType>(
    path: string,
    token?: string,
  ): Promise<ResponseHandler<ResponseType>> {
    const agent = createTestAgent(token);
    const response = await agent.delete(path).send();
    return createResponseHandler<ResponseType>(response);
  }

  return {
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
