import { MUUID } from 'uuid-mongodb';

export type PersistedEntity<T extends { id: string }> = Omit<T, 'id'> & { _id: MUUID };
