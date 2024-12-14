import { z } from 'zod';
import { movieSchema } from './movie';

export const createMovieSchema = z.object({
  body: movieSchema,
});

export type CreateMovieBody = z.infer<typeof createMovieSchema.shape.body>;
