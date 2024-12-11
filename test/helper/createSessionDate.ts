import { addDays, format } from 'date-fns';
import { SessionDate } from '../../src/domain/movie/valueObjects/sessionDate';

export function createSessionDate(daysToAdd: number = 1): SessionDate {
  const sessionDate = addDays(new Date(), daysToAdd);
  const formattedSessionDate = format(sessionDate, 'yyyy-MM-dd');
  return SessionDate.create(formattedSessionDate);
}
