export type ErrorResponse = {
  error: string;
};

export function createErrorResponse(error: string): ErrorResponse {
  return { error };
}
