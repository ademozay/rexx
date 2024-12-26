import { Actor } from '../../shared/actor';

export type BuyTicketUseCaseInput = {
  actor: Actor;
  sessionId: string;
};

export type BuyTicketUseCaseOutput = {
  ticket: {
    id: string;
  };
};
