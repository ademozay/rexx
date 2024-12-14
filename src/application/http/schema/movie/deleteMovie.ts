import { z } from 'zod';

export const deleteMovieSchema = z.object({
  params: z.object({
    movieId: z.string({ message: 'Missing movie id' }),
  }),
});

export type DeleteMovieParams = z.infer<typeof deleteMovieSchema.shape.params>;
