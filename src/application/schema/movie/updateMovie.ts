import { z } from 'zod';
import { movieSchema } from './movie';

export const updateMovieSchema = z.object({
  params: z.object({
    movieId: z.string({ message: 'Missing movie id' }),
  }),
  body: movieSchema,
});

export type UpdateMovieBody = z.infer<typeof updateMovieSchema.shape.body>;
export type UpdateMovieParams = z.infer<typeof updateMovieSchema.shape.params>;
