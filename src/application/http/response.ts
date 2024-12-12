export type ErrorResponse = {
  error: {
    message: string;
  };
};

export function createErrorResponse(message: string): ErrorResponse {
  return { error: { message } };
}
