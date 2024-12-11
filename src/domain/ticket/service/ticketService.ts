import { inject, injectable } from 'inversify';
import { InjectionToken } from '../../../injectionToken';
import { Ticket } from '../entity/ticket';
import { TicketPort } from '../port/ticketPort';

@injectable()
export class TicketService {
  constructor(
    @inject(InjectionToken.TicketPort)
    private readonly ticketPort: TicketPort,
  ) {}

  async createTicket(ticket: Ticket): Promise<Ticket> {
    return this.ticketPort.createTicket(ticket);
  }

  async updateTicket(ticket: Ticket): Promise<Ticket> {
    return this.ticketPort.updateTicket(ticket);
  }

  async findTicketById(ticketId: string): Promise<Ticket | undefined> {
    return this.ticketPort.findTicketById(ticketId);
  }
}
