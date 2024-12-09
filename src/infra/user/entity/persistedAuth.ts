import { MUUID } from 'uuid-mongodb';

export type PersistedAuth = {
  userId: MUUID;
  token: string;
};
