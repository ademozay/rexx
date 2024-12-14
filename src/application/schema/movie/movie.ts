import { z } from 'zod';
import { AgeRestriction } from '../../../domain/movie/entity/ageRestriction';

export const movieSchema = z.object({
  name: z.string({ message: 'Missing name' }),
  ageRestriction: z.nativeEnum(AgeRestriction, {
    message: `Invalid age restriction. Valid values are: ${Object.values(AgeRestriction).join(
      ', ',
    )}`,
  }),
});
