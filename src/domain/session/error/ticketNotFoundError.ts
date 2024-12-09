import { DomainError } from '../../shared/domainError';

export class TicketNotFoundError extends DomainError {
  constructor(readonly ticketId: string) {
    super(`Ticket not found: ${ticketId}`);
  }
}
