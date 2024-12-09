export interface UseCaseHandler<C, R> {
  handle(useCase: C): Promise<R>;
}
