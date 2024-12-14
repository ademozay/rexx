import { z } from 'zod';

export type ErrorResponse = {
  error: {
    message: string;
    validationErrors?: ValidationError[];
  };
};

export type ValidationError = {
  field: string;
  message: string;
};

export function createErrorResponse(message: string): ErrorResponse {
  return { error: { message } };
}

export function createValidationErrorResponse(zodError: z.ZodError): ErrorResponse {
  const message = 'Invalid request';
  const error = createErrorResponse(message);

  const validationErrors = zodError.errors.map<ValidationError>((zodIssue) => ({
    // TODO: find a better way to get the field name
    field: zodIssue.path.join('.').split('.').pop() ?? '',
    message: zodIssue.message,
  }));

  return {
    error: {
      ...error.error,
      validationErrors,
    },
  };
}
