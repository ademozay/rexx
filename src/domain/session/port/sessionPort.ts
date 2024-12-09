import { Session } from '../entity/session';
import { Ticket } from '../entity/ticket';

export interface SessionPort {
  createSession(session: Session): Promise<Session>;
  updateSession(session: Session): Promise<Session>;
  deleteSession(sessionId: string): Promise<void>;
  sessionExists(session: Session): Promise<boolean>;
  findSessionById(sessionId: string): Promise<Session | undefined>;
  findSessionsByMovieIds(movieIds: string[]): Promise<Session[]>;

  createTicket(ticket: Ticket): Promise<Ticket>;
  markTicketAsUsed(ticketId: string): Promise<void>;
  findTicketById(ticketId: string): Promise<Ticket | undefined>;
  findTicketBySessionId(sessionId: string): Promise<Ticket | undefined>;
}
