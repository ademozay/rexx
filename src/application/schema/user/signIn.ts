import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export type SignInBody = z.infer<typeof signInSchema>;
