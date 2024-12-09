import { DomainError } from '../../shared/domainError';

export class TicketAlreadyUsedError extends DomainError {
  constructor(readonly ticketId: string) {
    super(`Ticket already used: ${ticketId}`);
  }
}
