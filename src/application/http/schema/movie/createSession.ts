import { z } from 'zod';
import { sessionSchema } from './session';

export const createSessionSchema = z.object({
  params: z.object({
    movieId: z.string({ message: 'Missing movie id' }),
  }),
  body: sessionSchema,
});

export type CreateSessionBody = z.infer<typeof createSessionSchema.shape.body>;
export type CreateSessionParams = z.infer<typeof createSessionSchema.shape.params>;
