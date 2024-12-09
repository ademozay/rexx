import { DomainError } from '../../shared/domainError';

export class TicketUserMismatchError extends DomainError {
  constructor(readonly ticketId: string) {
    super(`Ticket does not belong to user: ${ticketId}`);
  }
}
