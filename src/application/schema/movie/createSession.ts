import { z } from 'zod';
import { sessionSchema } from './session';

export const createSessionSchema = z.object({
  body: sessionSchema,
});

export type CreateSessionBody = z.infer<typeof createSessionSchema.shape.body>;
