import { Ticket } from '../entity/ticket';

export interface TicketPort {
  createTicket(ticket: Ticket): Promise<Ticket>;
  updateTicket(ticket: Ticket): Promise<Ticket>;
  findTicketById(ticketId: string): Promise<Ticket | undefined>;
  findTicketBySessionId(sessionId: string): Promise<Ticket | undefined>;
}
