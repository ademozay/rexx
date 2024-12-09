import { Ticket } from '../../../domain/session/entity/ticket';

export type TicketResponse = {
  id: string;
};

export class TicketMapper {
  static toResponse(ticket: Ticket): TicketResponse {
    return { id: ticket.id };
  }
}
