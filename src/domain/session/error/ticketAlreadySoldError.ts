import { DomainError } from '../../shared/domainError';

export class TicketAlreadySoldError extends DomainError {
  constructor(readonly ticketId: string) {
    super(`Ticket already sold: ${ticketId}`);
  }
}
