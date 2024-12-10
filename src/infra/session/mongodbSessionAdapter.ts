import { Collection, MongoClient } from 'mongodb';
import { from } from 'uuid-mongodb';
import { Session } from '../../domain/session/entity/session';
import { Ticket } from '../../domain/session/entity/ticket';
import { SessionPort } from '../../domain/session/port/sessionPort';
import { PersistedSession } from './entity/persistedSession';
import { PersistedTicket } from './entity/persistedTicket';

export class MongodbSessionAdapter implements SessionPort {
  private readonly sessionCollection: Collection<PersistedSession>;

  private readonly ticketCollection: Collection<PersistedTicket>;

  constructor(mongoClient: MongoClient, databaseName: string) {
    this.sessionCollection = mongoClient.db(databaseName).collection('session');
    this.ticketCollection = mongoClient.db(databaseName).collection('ticket');
  }

  async createIndexes(): Promise<void> {
    await this.sessionCollection.createIndex(
      {
        movieId: 1,
        sessionDate: 1,
        timeSlotLabel: 1,
      },
      { unique: true },
    );
    await this.ticketCollection.createIndex({ sessionId: 1 });
  }

  async createSession(session: Session): Promise<Session> {
    await this.sessionCollection.insertOne({
      _id: from(session.id),
      movieId: session.movieId,
      sessionDate: session.sessionDate.value,
      timeSlotLabel: session.timeSlot.value,
      roomNumber: session.roomNumber,
    });

    return session;
  }

  async updateSession(session: Session): Promise<Session> {
    await this.sessionCollection.updateOne(
      { _id: from(session.id) },
      {
        $set: {
          movieId: session.movieId,
          sessionDate: session.sessionDate.value,
          timeSlotLabel: session.timeSlot.value,
          roomNumber: session.roomNumber,
        },
      },
    );

    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessionCollection.deleteOne({ _id: from(sessionId) });
  }

  async findSessionById(sessionId: string): Promise<Session | undefined> {
    const session = await this.sessionCollection.findOne({ _id: from(sessionId) });
    if (!session) {
      return undefined;
    }

    return Session.hydrate(
      {
        movieId: session.movieId,
        sessionDate: session.sessionDate,
        timeSlotLabel: session.timeSlotLabel,
        roomNumber: session.roomNumber,
      },
      session._id.toString(),
    );
  }

  async findSessionsByMovieIds(movieIds: string[]): Promise<Session[]> {
    const sessions = await this.sessionCollection.find({ movieId: { $in: movieIds } }).toArray();

    return sessions.map((session) =>
      Session.hydrate(
        {
          movieId: session.movieId,
          sessionDate: session.sessionDate,
          timeSlotLabel: session.timeSlotLabel,
          roomNumber: session.roomNumber,
        },
        session._id.toString(),
      ),
    );
  }

  async sessionExists(session: Session): Promise<boolean> {
    const existingSession = await this.sessionCollection.findOne({
      movieId: session.movieId,
      sessionDate: session.sessionDate.value,
      timeSlotLabel: session.timeSlot.value,
      roomNumber: session.roomNumber,
    });

    return !!existingSession;
  }

  async createTicket(ticket: Ticket): Promise<Ticket> {
    await this.ticketCollection.insertOne({
      _id: from(ticket.id),
      userId: ticket.userId,
      sessionId: ticket.sessionId,
    });

    return ticket;
  }

  async markTicketAsUsed(ticketId: string): Promise<void> {
    await this.ticketCollection.updateOne({ _id: from(ticketId) }, { $set: { used: true } });
  }

  async findTicketById(ticketId: string): Promise<Ticket | undefined> {
    const ticket = await this.ticketCollection.findOne({ _id: from(ticketId) });
    if (!ticket) {
      return undefined;
    }

    return Ticket.hydrate(ticket, ticket._id.toString());
  }

  async findTicketBySessionId(sessionId: string): Promise<Ticket | undefined> {
    const ticket = await this.ticketCollection.findOne({ sessionId });
    if (!ticket) {
      return undefined;
    }

    return Ticket.hydrate(ticket, ticket._id.toString());
  }
}
