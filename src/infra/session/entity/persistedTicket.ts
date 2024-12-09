import { Ticket } from '../../../domain/session/entity/ticket';
import { PersistedEntity } from '../../mongodb/persistedEntity';

export type PersistedTicket = PersistedEntity<Pick<Ticket, 'id' | 'userId' | 'sessionId'>>;
