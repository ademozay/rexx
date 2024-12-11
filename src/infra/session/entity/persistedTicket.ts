import { MUUID } from 'uuid-mongodb';
import { Ticket } from '../../../domain/ticket/entity/ticket';
import { PersistedEntity } from '../../mongodb/persistedEntity';

export type PersistedTicket = PersistedEntity<
  Pick<Ticket, 'id' | 'used'> & {
    userId: MUUID;
    sessionId: MUUID;
  }
>;
