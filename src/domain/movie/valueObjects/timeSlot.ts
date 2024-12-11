import { ValueObject } from '../../shared/valueObject';
import { SessionDate } from './sessionDate';

export enum TimeSlotLabel {
  Morning = 'Morning',
  Noon = 'Noon',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  LateEvening = 'LateEvening',
  Night = 'Night',
  LateNight = 'LateNight',
}

type TimeSlotRange = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};

type TimeSlotRangeMap = {
  [key in TimeSlotLabel]: TimeSlotRange;
};

function createTimeSlotRange(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): TimeSlotRange {
  return { startHour, startMinute, endHour, endMinute };
}

const timeSlotRangeMap: TimeSlotRangeMap = {
  [TimeSlotLabel.Morning]: createTimeSlotRange(10, 0, 12, 0),
  [TimeSlotLabel.Noon]: createTimeSlotRange(12, 0, 14, 0),
  [TimeSlotLabel.Afternoon]: createTimeSlotRange(14, 0, 16, 0),
  [TimeSlotLabel.Evening]: createTimeSlotRange(16, 0, 18, 0),
  [TimeSlotLabel.LateEvening]: createTimeSlotRange(18, 0, 20, 0),
  [TimeSlotLabel.Night]: createTimeSlotRange(20, 0, 22, 0),
  [TimeSlotLabel.LateNight]: createTimeSlotRange(22, 0, 0, 0),
};

export class TimeSlot extends ValueObject<TimeSlotLabel> {
  private constructor(timeSlotLabel: TimeSlotLabel) {
    super(timeSlotLabel);
  }

  static create(timeSlotLabel: TimeSlotLabel): TimeSlot {
    return new TimeSlot(timeSlotLabel);
  }

  hasStarted(sessionDate: SessionDate): boolean {
    const now = new Date();
    const { startDate } = this.rangeInDate(sessionDate.date);
    return now >= startDate;
  }

  hasFinished(sessionDate: SessionDate): boolean {
    const now = new Date();
    const { endDate } = this.rangeInDate(sessionDate.date);
    return now >= endDate;
  }

  private rangeInDate(date: Date): { startDate: Date; endDate: Date } {
    const { startHour, startMinute, endHour, endMinute } = timeSlotRangeMap[this.value];

    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute, 0, 0);

    return { startDate, endDate };
  }
}
