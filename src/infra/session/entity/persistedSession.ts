import { MUUID } from 'uuid-mongodb';
import { Session } from '../../../domain/session/entity/session';
import { TimeSlotLabel } from '../../../domain/session/valueObjects/timeSlot';
import { PersistedEntity } from '../../mongodb/persistedEntity';

export type PersistedSession = PersistedEntity<
  Pick<Session, 'id' | 'roomNumber'> & {
    movieId: MUUID;
    sessionDate: string;
    timeSlotLabel: TimeSlotLabel;
  }
>;
