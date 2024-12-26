import { BuyTicketUseCaseOutput } from '../../../domain/ticket/useCase/buyTicketUseCase';

export type TicketResponse = {
  id: string;
};

export class TicketMapper {
  static toResponse({ ticket }: BuyTicketUseCaseOutput): TicketResponse {
    return { id: ticket.id };
  }
}
