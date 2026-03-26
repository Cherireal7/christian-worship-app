import dayjs, { type Dayjs } from 'dayjs';

import lsb1yrData from './lsb-1yr.json';
import lsbDailyData from './lsb-daily.json';
import lsbFestivalsData from './lsb-festivals.json';
import lsbCommemorationsData from './lsb-commemorations.json';

export type LiturgicalTextValue = string | boolean | null;

export type LiturgicalEntry = {
  week?: number | null;
  month?: number | null;
  day: number;
  type: number;
  text: LiturgicalTextValue;
};

export type LiturgicalColorName =
  | 'Blue'
  | 'Violet'
  | 'White'
  | 'Red'
  | 'Green'
  | 'Scarlet'
  | 'Black'
  | string;

export type LiturgicalPropers = {
  epistle: string | null;
  gospel: string | null;
  oldTestament: string | null;
  collect: string | null;
  introit: string | null;
  gradual: string | null;
  verse: string | null;
};

export type LiturgicalDailyReadings = {
  firstReading: string | null;
  secondReading: string | null;
};

export type LiturgicalDay = {
  date: string;
  weekNumber: number | null;
  weekName: string | null;
  season: string;
  color: LiturgicalColorName;
  isSunday: boolean;
  isFestival: boolean;
  festivalTitle: string | null;
  moveableFeast: string | null;
  saintsDay: string | null;
  propers: LiturgicalPropers;
  dailyReadings: LiturgicalDailyReadings;
  raw: {
    sundayPropers: LiturgicalEntry[];
    festivalPropers: LiturgicalEntry[];
    dailyReadings: LiturgicalEntry[];
    commemorations: LiturgicalEntry[];
  };
};

export type LiturgicalCalendarGrid = Array<Array<LiturgicalDay | null>>;

export type LiturgicalKeyDates = {
  ashWednesday: string;
  palmSunday: string;
  maundyThursday: string;
  goodFriday: string;
  easter: string;
  ascension: string;
  pentecost: string;
  trinitySunday: string;
  advent1: string;
  christmas: string;
};

const lsb1yr = lsb1yrData as LiturgicalEntry[];
const lsbDaily = lsbDailyData as LiturgicalEntry[];
const lsbFestivals = lsbFestivalsData as LiturgicalEntry[];
const lsbCommemorations = lsbCommemorationsData as LiturgicalEntry[];

export const TYPE = {
  TITLE: 0,
  EPISTLE: 1,
  GOSPEL: 2,
  OLD_TESTAMENT: 19,
  COLLECT: 20,
  INTROIT: 23,
  COLOR: 25,
  FESTIVAL: 34,
  GRADUAL: 35,
  VERSE: 36,
  COMMEMORATION: 37,
  FIRST_READING: 38,
  SECOND_READING: 39,
} as const;

export const SUNDAYS = {
  ADVENT_1: 1,
  ADVENT_2: 2,
  ADVENT_3: 3,
  ADVENT_4: 4,
  SUNDAY_AFTER_CHRISTMAS: 5,
  SUNDAY_AFTER_NEW_YEARS: 6,
  THE_BAPTISM_OF_OUR_LORD: 7,
  EPIPHANY_2: 8,
  EPIPHANY_3: 9,
  EPIPHANY_4: 10,
  EPIPHANY_5: 11,
  TRANSFIGURATION: 12,
  SEPTUAGESIMA: 13,
  SEXAGESIMA: 14,
  QUINQUAGESIMA: 15,
  LENT_1: 16,
  LENT_2: 17,
  LENT_3: 18,
  LENT_4: 19,
  LENT_5: 20,
  PALM_SUNDAY: 21,
  EASTER: 22,
  EASTER_2: 23,
  EASTER_3: 24,
  EASTER_4: 25,
  EASTER_5: 26,
  EASTER_6: 27,
  SUNDAY_AFTER_THE_ASCENSION: 28,
  PENTECOST: 29,
  TRINITY_SUNDAY: 30,
  TRINITY_1: 31,
  TRINITY_2: 32,
  TRINITY_3: 33,
  TRINITY_4: 34,
  TRINITY_5: 35,
  TRINITY_6: 36,
  TRINITY_7: 37,
  TRINITY_8: 38,
  TRINITY_9: 39,
  TRINITY_10: 40,
  TRINITY_11: 41,
  TRINITY_12: 42,
  TRINITY_13: 43,
  TRINITY_14: 44,
  TRINITY_15: 45,
  TRINITY_16: 46,
  TRINITY_17: 47,
  TRINITY_18: 48,
  TRINITY_19: 49,
  TRINITY_20: 50,
  TRINITY_21: 51,
  TRINITY_22: 52,
  TRINITY_23: 53,
  TRINITY_24: 54,
  THIRD_LAST_SUNDAY: 55,
  SECOND_LAST_SUNDAY: 56,
  LAST_SUNDAY: 57,
} as const;

const WEEK_NAMES: Record<number, string> = {
  1: 'Advent 1',
  2: 'Advent 2',
  3: 'Advent 3',
  4: 'Advent 4',
  5: 'Sunday after Christmas',
  6: "Sunday after New Year's",
  7: 'Baptism of Our Lord',
  8: 'Epiphany 2',
  9: 'Epiphany 3',
  10: 'Epiphany 4',
  11: 'Epiphany 5',
  12: 'Transfiguration',
  13: 'Septuagesima',
  14: 'Sexagesima',
  15: 'Quinquagesima',
  16: 'Lent 1',
  17: 'Lent 2',
  18: 'Lent 3',
  19: 'Lent 4',
  20: 'Lent 5',
  21: 'Palm Sunday',
  22: 'Easter',
  23: 'Easter 2',
  24: 'Easter 3',
  25: 'Easter 4',
  26: 'Easter 5',
  27: 'Easter 6',
  28: 'Sunday after the Ascension',
  29: 'Pentecost',
  30: 'Trinity Sunday',
  31: 'Trinity 1',
  32: 'Trinity 2',
  33: 'Trinity 3',
  34: 'Trinity 4',
  35: 'Trinity 5',
  36: 'Trinity 6',
  37: 'Trinity 7',
  38: 'Trinity 8',
  39: 'Trinity 9',
  40: 'Trinity 10',
  41: 'Trinity 11',
  42: 'Trinity 12',
  43: 'Trinity 13',
  44: 'Trinity 14',
  45: 'Trinity 15',
  46: 'Trinity 16',
  47: 'Trinity 17',
  48: 'Trinity 18',
  49: 'Trinity 19',
  50: 'Trinity 20',
  51: 'Trinity 21',
  52: 'Trinity 22',
  53: 'Trinity 23',
  54: 'Trinity 24',
  55: 'Third Last Sunday',
  56: 'Second Last Sunday',
  57: 'Last Sunday',
};

function getSeasonFromWeek(weekNum: number | null): { season: string; color: LiturgicalColorName } {
  if (!weekNum) {
    return { season: 'Ordinary', color: 'Green' };
  }
  if (weekNum <= 4) {
    return { season: 'Advent', color: 'Blue' };
  }
  if (weekNum <= 6) {
    return { season: 'Christmas', color: 'White' };
  }
  if (weekNum <= 12) {
    return { season: 'Epiphany', color: 'Green' };
  }
  if (weekNum <= 15) {
    return { season: 'Pre-Lent', color: 'Violet' };
  }
  if (weekNum <= 20) {
    return { season: 'Lent', color: 'Violet' };
  }
  if (weekNum === 21) {
    return { season: 'Holy Week', color: 'Scarlet' };
  }
  if (weekNum <= 28) {
    return { season: 'Easter', color: 'White' };
  }
  if (weekNum === 29 || weekNum === 30) {
    return { season: 'Pentecost', color: 'Red' };
  }
  return { season: 'Trinity', color: 'Green' };
}

function computeEaster(year: number): Dayjs {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;
  const month = Math.floor(n / 31);
  const day = (n % 31) + 1;

  return dayjs(new Date(year, month - 1, day));
}

function getLiturgicalDates(year: number) {
  const easter = computeEaster(year);
  const christmas = dayjs(new Date(year, 11, 25));
  const christmasWeekday = christmas.day();
  const advent =
    christmasWeekday === 0
      ? christmas.subtract(28, 'day')
      : christmas.subtract(christmasWeekday, 'day').subtract(21, 'day');
  const epiphany = dayjs(new Date(year, 0, 6));
  const epiphanyWeekday = epiphany.day();
  const epiphanySunday =
    epiphanyWeekday === 0 ? epiphany : epiphany.subtract(epiphanyWeekday, 'day');
  const transfiguration = easter.subtract(70, 'day');
  const ashWednesday = easter.subtract(46, 'day');
  const lent1 = easter.subtract(42, 'day');
  const lastSunday = advent.subtract(7, 'day');
  const endOfYear = advent.subtract(21, 'day');

  return {
    easter,
    christmas,
    advent,
    epiphany,
    epiphanySunday,
    transfiguration,
    ashWednesday,
    lent1,
    lastSunday,
    endOfYear,
  };
}

function getSunday(d: Dayjs): Dayjs {
  const weekday = d.day();
  return weekday === 0 ? d : d.subtract(weekday, 'day');
}

function weekDiff(from: Dayjs, to: Dayjs): number {
  return Math.round(to.diff(from, 'day') / 7);
}

export function getWeekNumber(date: Date | string | Dayjs): number | null {
  const d = dayjs(date).startOf('day');
  const year = d.year();
  const dates = getLiturgicalDates(year);
  const sunday = getSunday(d);

  if (sunday.month() === 11 && sunday.date() === 25) {
    return null;
  }

  const { advent, epiphany, epiphanySunday, transfiguration, endOfYear, lastSunday } = dates;

  if (sunday.isSame(advent) || sunday.isAfter(advent)) {
    return 1 + weekDiff(advent, sunday);
  }

  if (!sunday.isBefore(epiphany) && sunday.isBefore(transfiguration)) {
    return 6 + weekDiff(epiphanySunday, sunday);
  }

  if (sunday.isBefore(epiphany)) {
    return 6 - weekDiff(sunday, epiphanySunday);
  }

  if (!sunday.isBefore(transfiguration) && !sunday.isAfter(endOfYear)) {
    return 12 + weekDiff(transfiguration, sunday);
  }

  return 57 - weekDiff(sunday, lastSunday);
}

function loadPropers(d: Dayjs, weekNum: number | null, dataset: LiturgicalEntry[]): LiturgicalEntry[] {
  const weekday = d.day();
  const month = d.month() + 1;
  const calendarDay = d.date();

  return dataset.filter(entry => {
    const entryWeek = entry.week ?? null;
    const entryMonth = entry.month ?? null;

    return (
      (entryWeek !== null && entryWeek === weekNum && entry.day === weekday) ||
      (entryWeek === null && entryMonth === month && entry.day === calendarDay)
    );
  });
}

function extractText(propers: LiturgicalEntry[], typeCode: number): string | null {
  const match = propers.find(
    (entry): entry is LiturgicalEntry & { text: string } =>
      entry.type === typeCode && typeof entry.text === 'string',
  );
  return match ? match.text : null;
}

function getMoveableFeastName(d: Dayjs): string | null {
  const year = d.year();
  const dates = getLiturgicalDates(year);
  const formatDate = (value: Dayjs) => value.format('YYYY-MM-DD');
  const key = d.format('YYYY-MM-DD');

  const map: Record<string, string> = {
    [formatDate(dates.ashWednesday)]: 'Ash Wednesday',
    [formatDate(dates.easter.subtract(3, 'day'))]: 'Maundy Thursday',
    [formatDate(dates.easter.subtract(2, 'day'))]: 'Good Friday',
    [formatDate(dates.easter.subtract(1, 'day'))]: 'Holy Saturday',
    [formatDate(dates.easter)]: 'Easter Sunday',
    [formatDate(dates.easter.add(39, 'day'))]: 'Ascension Day',
    [formatDate(dates.easter.add(49, 'day'))]: 'Pentecost',
  };

  return map[key] ?? null;
}

export function getDay(date: Date | string | Dayjs): LiturgicalDay {
  const d = dayjs(date).startOf('day');
  const weekNum = getWeekNumber(d);
  const month = d.month() + 1;
  const calendarDay = d.date();

  const sundayPropers = loadPropers(d, weekNum, lsb1yr);
  const festivalPropers = lsbFestivals.filter(
    entry => entry.month === month && entry.day === calendarDay,
  );
  const dailyRaw = lsbDaily.filter(entry => entry.month === month && entry.day === calendarDay);
  const commemorations = lsbCommemorations.filter(
    entry => entry.month === month && entry.day === calendarDay,
  );

  const festivalColor = extractText(festivalPropers, TYPE.COLOR);
  const sundayColor = extractText(sundayPropers, TYPE.COLOR);
  const seasonDefaults = getSeasonFromWeek(weekNum);
  const color = festivalColor || sundayColor || seasonDefaults.color;
  const isFestival = festivalPropers.some(entry => entry.type === TYPE.FESTIVAL && entry.text === true);
  const festivalTitle =
    extractText(festivalPropers, TYPE.TITLE) || extractText(sundayPropers, TYPE.TITLE);
  const moveableFeast = getMoveableFeastName(d);
  const saintsDay =
    commemorations.length > 0
      ? commemorations
          .map(entry => entry.text)
          .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)
          .join('; ')
      : null;
  const allPropers = [...festivalPropers, ...sundayPropers];

  return {
    date: d.format('YYYY-MM-DD'),
    weekNumber: weekNum,
    weekName: weekNum ? WEEK_NAMES[weekNum] ?? null : null,
    season: seasonDefaults.season,
    color,
    isSunday: d.day() === 0,
    isFestival,
    festivalTitle,
    moveableFeast,
    saintsDay,
    propers: {
      epistle: extractText(allPropers, TYPE.EPISTLE),
      gospel: extractText(allPropers, TYPE.GOSPEL),
      oldTestament: extractText(allPropers, TYPE.OLD_TESTAMENT),
      collect: extractText(allPropers, TYPE.COLLECT),
      introit: extractText(allPropers, TYPE.INTROIT),
      gradual: extractText(allPropers, TYPE.GRADUAL),
      verse: extractText(allPropers, TYPE.VERSE),
    },
    dailyReadings: {
      firstReading: extractText(dailyRaw, TYPE.FIRST_READING),
      secondReading: extractText(dailyRaw, TYPE.SECOND_READING),
    },
    raw: {
      sundayPropers,
      festivalPropers,
      dailyReadings: dailyRaw,
      commemorations,
    },
  };
}

export function getMonthCalendar(year: number, month: number): LiturgicalCalendarGrid {
  const first = dayjs(new Date(year, month - 1, 1));
  const last = dayjs(new Date(year, month - 1, first.daysInMonth()));
  let current = first.day() === 0 ? first : first.subtract(first.day(), 'day');
  const grid: LiturgicalCalendarGrid = [];

  while (current.isBefore(last) || current.isSame(last, 'day')) {
    const row: Array<LiturgicalDay | null> = [];

    for (let column = 0; column < 7; column += 1) {
      const inMonth = current.month() + 1 === month;
      row.push(inMonth ? getDay(current.toDate()) : null);
      current = current.add(1, 'day');
    }

    grid.push(row);
  }

  return grid;
}

export function getKeyDates(year: number): LiturgicalKeyDates {
  const dates = getLiturgicalDates(year);
  const formatDate = (value: Dayjs) => value.format('YYYY-MM-DD');

  return {
    ashWednesday: formatDate(dates.ashWednesday),
    palmSunday: formatDate(dates.easter.subtract(7, 'day')),
    maundyThursday: formatDate(dates.easter.subtract(3, 'day')),
    goodFriday: formatDate(dates.easter.subtract(2, 'day')),
    easter: formatDate(dates.easter),
    ascension: formatDate(dates.easter.add(39, 'day')),
    pentecost: formatDate(dates.easter.add(49, 'day')),
    trinitySunday: formatDate(dates.easter.add(56, 'day')),
    advent1: formatDate(dates.advent),
    christmas: formatDate(dates.christmas),
  };
}

export function getToday(): LiturgicalDay {
  return getDay(new Date());
}
