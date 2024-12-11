import { Ticket } from '../../../domain/ticket/entity/ticket';

export type TicketResponse = {
  id: string;
};

export class TicketMapper {
  static toResponse(ticket: Ticket): TicketResponse {
    return { id: ticket.id };
  }
}
