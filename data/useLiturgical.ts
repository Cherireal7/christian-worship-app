import { useEffect, useMemo, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';

import {
  getDay,
  getKeyDates,
  getMonthCalendar,
  getToday,
  type LiturgicalCalendarGrid,
  type LiturgicalDay,
  type LiturgicalKeyDates,
} from './LiturgicalService';

type LiturgicalInputDate = Date | string | Dayjs | null;

export function useLiturgicalDay(date: LiturgicalInputDate = null): LiturgicalDay | null {
  const key = date ? dayjs(date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

  return useMemo(() => {
    try {
      return getDay(key);
    } catch (error) {
      console.error('[useLiturgicalDay] Failed to compute day:', error);
      return null;
    }
  }, [key]);
}

export function useLiturgicalMonth(year: number, month: number): LiturgicalCalendarGrid {
  return useMemo(() => {
    try {
      return getMonthCalendar(year, month);
    } catch (error) {
      console.error('[useLiturgicalMonth] Failed to compute month:', error);
      return [];
    }
  }, [month, year]);
}

export function useLiturgicalKeyDates(year: number | null = null): Partial<LiturgicalKeyDates> {
  const safeYear = year ?? new Date().getFullYear();

  return useMemo(() => {
    try {
      return getKeyDates(safeYear);
    } catch (error) {
      console.error('[useLiturgicalKeyDates] Failed to compute key dates:', error);
      return {};
    }
  }, [safeYear]);
}

export function useToday(): LiturgicalDay | null {
  const [todayKey, setTodayKey] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const now = dayjs();
    const next = now.add(1, 'day').startOf('day');
    const millisecondsUntilMidnight = next.diff(now);

    const timer = setTimeout(() => {
      setTodayKey(dayjs().format('YYYY-MM-DD'));
    }, millisecondsUntilMidnight);

    return () => clearTimeout(timer);
  }, [todayKey]);

  return useMemo(() => {
    try {
      return getToday();
    } catch (error) {
      console.error('[useToday] Failed to compute today:', error);
      return null;
    }
  }, [todayKey]);
}
