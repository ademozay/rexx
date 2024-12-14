import { z } from 'zod';
import { registrationSchema } from './registration';

export const registerManagerSchema = z.object({
  body: registrationSchema,
});

export type RegisterManagerBody = z.infer<typeof registerManagerSchema.shape.body>;
