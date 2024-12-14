import { z } from 'zod';
import { registrationSchema } from './registration';

export const registerCustomerSchema = z.object({
  body: registrationSchema,
});

export type RegisterCustomerBody = z.infer<typeof registerCustomerSchema.shape.body>;
