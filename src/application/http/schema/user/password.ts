import { z } from 'zod';

export const passwordSchema = z
  .string()
  // More refinements could be added here
  .min(8, { message: 'Password must be at least 8 characters long' });
