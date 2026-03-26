import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import dayjs, { type Dayjs } from 'dayjs';

import {
  type LiturgicalCalendarGrid,
  type LiturgicalDay,
} from './LiturgicalService';
import { useLiturgicalDay, useLiturgicalMonth, useToday } from './useLiturgical';

type LiturgicalInputDate = Date | string | Dayjs;

export type LiturgicalContextValue = {
  today: LiturgicalDay | null;
  selectedDate: Date;
  setSelectedDate: (date: LiturgicalInputDate) => void;
  selectedDay: LiturgicalDay | null;
  calendarGrid: LiturgicalCalendarGrid;
  isToday: boolean;
  selectedDateFormatted: string;
  selectedMonthLabel: string;
};

const LiturgicalContext = createContext<LiturgicalContextValue | null>(null);

export function LiturgicalProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDateRaw] = useState<Date>(new Date());

  const setSelectedDate = useCallback((date: LiturgicalInputDate) => {
    setSelectedDateRaw(dayjs(date).toDate());
  }, []);

  const today = useToday();
  const selectedDay = useLiturgicalDay(selectedDate);
  const calendarGrid = useLiturgicalMonth(
    dayjs(selectedDate).year(),
    dayjs(selectedDate).month() + 1,
  );

  const value = useMemo<LiturgicalContextValue>(
    () => ({
      today,
      selectedDate,
      setSelectedDate,
      selectedDay,
      calendarGrid,
      isToday: dayjs(selectedDate).isSame(dayjs(), 'day'),
      selectedDateFormatted: dayjs(selectedDate).format('MMMM D, YYYY'),
      selectedMonthLabel: dayjs(selectedDate).format('MMMM YYYY'),
    }),
    [calendarGrid, selectedDate, selectedDay, setSelectedDate, today],
  );

  return <LiturgicalContext.Provider value={value}>{children}</LiturgicalContext.Provider>;
}

export function useLiturgical(): LiturgicalContextValue {
  const context = useContext(LiturgicalContext);

  if (!context) {
    throw new Error('useLiturgical() must be used within a <LiturgicalProvider>');
  }

  return context;
}

export default LiturgicalContext;
