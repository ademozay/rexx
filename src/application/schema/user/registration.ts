import { z } from 'zod';
import { passwordSchema } from './password';

export const registrationSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email' }),
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
    age: z
      .number()
      .min(18, { message: 'You must be at least 18 years old' })
      .positive({ message: 'Age must be a positive number' }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
      });
    }
  });
