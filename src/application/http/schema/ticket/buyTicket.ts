import { z } from 'zod';

export const buyTicketSchema = z.object({
  body: z.object({
    sessionId: z.string({ message: 'Missing session id' }),
  }),
});

export type BuyTicketBody = z.infer<typeof buyTicketSchema.shape.body>;
