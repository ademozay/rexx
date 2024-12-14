import { z } from 'zod';

export const watchMovieSchema = z.object({
  params: z.object({
    ticketId: z.string({ message: 'Missing ticket id' }),
  }),
});

export type WatchMovieParams = z.infer<typeof watchMovieSchema.shape.params>;
