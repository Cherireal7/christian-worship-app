import { CALENDAR_DAY_RECORDS } from '../data/calendar-days';

export type CalendarEventColor = 'gold' | 'rose' | 'violet';

export type CalendarDay = {
  id: string;
  date: string;
  title: string;
  summary: string;
  color: CalendarEventColor;
};

export const CALENDAR_DAYS: CalendarDay[] = CALENDAR_DAY_RECORDS;

export function getCalendarDayByDate(date: string) {
  return CALENDAR_DAYS.find(day => day.date === date);
}

export function getCalendarDaysForMonth(year: number, month: number) {
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  return CALENDAR_DAYS.filter(day => day.date.startsWith(monthKey));
}
