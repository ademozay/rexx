export interface UseCaseHandler<Input, Output> {
  handle(input: Input): Promise<Output>;
}
