import { z } from 'zod';
import { sessionSchema } from './session';

export const updateSessionSchema = z.object({
  params: z.object({
    sessionId: z.string({ message: 'Missing session id' }),
  }),
  body: sessionSchema,
});

export type UpdateSessionBody = z.infer<typeof updateSessionSchema.shape.body>;
export type UpdateSessionParams = z.infer<typeof updateSessionSchema.shape.params>;
