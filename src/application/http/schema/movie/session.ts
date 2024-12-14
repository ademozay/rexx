import { z } from 'zod';
import { TimeSlotLabel } from '../../../../domain/movie/valueObjects/timeSlot';

export const sessionSchema = z.object({
  sessionDate: z.string({ message: 'Missing session date' }),
  timeSlotLabel: z.nativeEnum(TimeSlotLabel, {
    message: `Invalid time slot label. Valid values are: ${Object.values(TimeSlotLabel).join(
      ', ',
    )}`,
  }),
  roomNumber: z.number({ message: 'Missing room number' }),
});
