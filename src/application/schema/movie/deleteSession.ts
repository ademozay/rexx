import { z } from 'zod';

export const deleteSessionSchema = z.object({
  params: z.object({
    sessionId: z.string({ message: 'Missing session id' }),
  }),
});

export type DeleteSessionParams = z.infer<typeof deleteSessionSchema.shape.params>;
