import { Collection, MongoClient } from 'mongodb';
import { from } from 'uuid-mongodb';
import { Ticket } from '../../domain/ticket/entity/ticket';
import { TicketPort } from '../../domain/ticket/port/ticketPort';
import { PersistedTicket } from './entity/persistedTicket';

export class MongodbTicketAdapter implements TicketPort {
  private readonly ticketCollection: Collection<PersistedTicket>;

  constructor(mongoClient: MongoClient, databaseName: string) {
    this.ticketCollection = mongoClient.db(databaseName).collection('ticket');
  }

  async createIndexes(): Promise<void> {
    await this.ticketCollection.createIndex({ sessionId: 1 });
  }

  async createTicket(ticket: Ticket): Promise<Ticket> {
    await this.ticketCollection.insertOne({
      _id: from(ticket.id),
      userId: from(ticket.userId),
      sessionId: from(ticket.sessionId),
      used: false,
    });

    return ticket;
  }

  async updateTicket(ticket: Ticket): Promise<Ticket> {
    await this.ticketCollection.updateOne(
      { _id: from(ticket.id) },
      {
        $set: {
          userId: from(ticket.userId),
          sessionId: from(ticket.sessionId),
          used: ticket.used,
        },
      },
    );

    return ticket;
  }

  async findTicketById(ticketId: string): Promise<Ticket | undefined> {
    const ticket = await this.ticketCollection.findOne({ _id: from(ticketId) });
    if (!ticket) {
      return undefined;
    }

    return Ticket.hydrate(
      {
        userId: ticket.userId.toString(),
        sessionId: ticket.sessionId.toString(),
      },
      ticket._id.toString(),
    );
  }

  async findTicketBySessionId(sessionId: string): Promise<Ticket | undefined> {
    const ticket = await this.ticketCollection.findOne({ sessionId: from(sessionId) });
    if (!ticket) {
      return undefined;
    }

    return Ticket.hydrate(
      {
        userId: ticket.userId.toString(),
        sessionId: ticket.sessionId.toString(),
      },
      ticket._id.toString(),
    );
  }
}
