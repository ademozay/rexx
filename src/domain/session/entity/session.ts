import { AggregateRoot } from '../../shared/aggregateRoot';
import { SessionDate } from '../valueObjects/sessionDate';
import { TimeSlot, TimeSlotLabel } from '../valueObjects/timeSlot';
import { Ticket } from './ticket';

interface SessionProps {
  movieId: string;
  sessionDate: SessionDate;
  timeSlot: TimeSlot;
  roomNumber: number;
}

export class Session extends AggregateRoot<SessionProps> {
  private constructor(props: SessionProps, id?: string) {
    super(props, id);
  }

  static create(
    props: Omit<SessionProps, 'timeSlot' | 'sessionDate'> & {
      timeSlotLabel: TimeSlotLabel;
      sessionDate: string;
    },
  ): Session {
    return new Session({
      ...props,
      sessionDate: SessionDate.create(props.sessionDate),
      timeSlot: TimeSlot.create(props.timeSlotLabel),
    });
  }

  static update(
    props: Omit<SessionProps, 'timeSlot' | 'sessionDate'> & {
      timeSlotLabel: TimeSlotLabel;
      sessionDate: string;
    },
    id: string,
  ): Session {
    return new Session(
      {
        ...props,
        sessionDate: SessionDate.create(props.sessionDate),
        timeSlot: TimeSlot.create(props.timeSlotLabel),
      },
      id,
    );
  }

  static hydrate(
    props: Omit<SessionProps, 'timeSlot' | 'sessionDate'> & {
      timeSlotLabel: TimeSlotLabel;
      sessionDate: string;
    },
    id: string,
  ): Session {
    return new Session(
      {
        ...props,
        sessionDate: SessionDate.create(props.sessionDate),
        timeSlot: TimeSlot.create(props.timeSlotLabel),
      },
      id,
    );
  }

  createTicket(userId: string): Ticket {
    return Ticket.create({
      userId,
      sessionId: this.id,
    });
  }

  get movieId(): string {
    return this.props.movieId;
  }

  get sessionDate(): SessionDate {
    return this.props.sessionDate;
  }

  get timeSlot(): TimeSlot {
    return this.props.timeSlot;
  }

  get roomNumber(): number {
    return this.props.roomNumber;
  }

  get hasStarted(): boolean {
    return this.props.timeSlot.hasStarted(this.sessionDate);
  }

  get hasFinished(): boolean {
    return this.props.timeSlot.hasFinished(this.sessionDate);
  }

  get isPast(): boolean {
    return this.sessionDate.date < new Date();
  }
}
