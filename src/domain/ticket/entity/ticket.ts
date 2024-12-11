import { Entity } from '../../shared/entity';

interface TicketProps {
  userId: string;
  sessionId: string;
  purchaseDate: Date;
  used: boolean;
}

export class Ticket extends Entity<TicketProps> {
  private constructor(props: TicketProps, id?: string) {
    super(props, id);
  }

  static create(props: Omit<TicketProps, 'purchaseDate' | 'used'>): Ticket {
    return new Ticket({
      ...props,
      purchaseDate: new Date(),
      used: false,
    });
  }

  static hydrate(props: Omit<TicketProps, 'purchaseDate' | 'used'>, id: string): Ticket {
    return new Ticket(
      {
        ...props,
        purchaseDate: new Date(),
        used: false,
      },
      id,
    );
  }

  markAsUsed(): void {
    this.props.used = true;
  }

  get userId(): string {
    return this.props.userId;
  }

  get sessionId(): string {
    return this.props.sessionId;
  }

  get used(): boolean {
    return this.props.used;
  }
}
