import { z } from 'zod';

export const deleteSessionSchema = z.object({
  params: z.object({
    movieId: z.string({ message: 'Missing movie id' }),
    sessionId: z.string({ message: 'Missing session id' }),
  }),
});

export type DeleteSessionParams = z.infer<typeof deleteSessionSchema.shape.params>;
