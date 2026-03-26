# Lectionary Module for React Native / Expo

Self-contained **Lutheran Historic 1-Year (LSB)** liturgical calendar for React Native.
No external lectionary dependencies. Algorithm ported from `stanlemon/lectionary-js` (MIT).

---

## File structure

Place all files in a `lectionary/` folder inside your project:

```
src/
└── lectionary/
    ├── LiturgicalService.js       ← core engine (algorithm + data lookups)
    ├── useLiturgical.js           ← React hooks
    ├── LiturgicalContext.js       ← app-wide context + provider
    ├── liturgicalColors.js        ← color palette utility
    ├── ExampleScreens.js          ← example calendar & day-detail screens
    ├── lsb-1yr.json               ← Sunday propers (1-year lectionary)
    ├── lsb-daily.json             ← daily office readings
    ├── lsb-festivals.json         ← feasts & festivals
    └── lsb-commemorations.json   ← saints days & commemorations
```

---

## Installation

Only one dependency is needed:

```bash
npx expo install dayjs
# or: npm install dayjs
```

---

## Setup

Wrap your root component with `<LiturgicalProvider>`:

```js
// App.js
import { LiturgicalProvider } from './lectionary/LiturgicalContext';

export default function App() {
  return (
    <LiturgicalProvider>
      <NavigationContainer>
        {/* your screens */}
      </NavigationContainer>
    </LiturgicalProvider>
  );
}
```

---

## Usage

### Hook: `useLiturgical()` — access everything from any screen

```js
import { useLiturgical } from './lectionary/LiturgicalContext';

function MyScreen() {
  const {
    today,            // today's full liturgical data
    selectedDay,      // selected date's full data
    selectedDate,     // JS Date object
    setSelectedDate,  // update selected date
    calendarGrid,     // 6×7 grid for the selected month
    selectedDateFormatted,  // e.g. "March 26, 2025"
    selectedMonthLabel,     // e.g. "March 2025"
  } = useLiturgical();
}
```

### Hook: `useLiturgicalDay(date?)` — single day, no context needed

```js
import { useLiturgicalDay } from './lectionary/useLiturgical';

const day = useLiturgicalDay(new Date('2025-12-25'));
// day.festivalTitle → "Christmas Day"
// day.color → "White"
// day.propers.epistle → "Heb. 1:1-12"
```

### Hook: `useToday()` — refreshes at midnight automatically

```js
import { useToday } from './lectionary/useLiturgical';

const today = useToday();
```

### Service (non-hook): direct calls

```js
import { getDay, getMonthCalendar, getKeyDates } from './lectionary/LiturgicalService';

const day   = getDay(new Date());
const grid  = getMonthCalendar(2025, 12);  // December 2025
const dates = getKeyDates(2026);           // Easter, Advent, etc.
```

---

## `getDay()` return shape

```js
{
  date:         'YYYY-MM-DD',
  weekNumber:   1–57,          // null on Christmas Sunday
  weekName:     'Advent 1',    // null if not a named Sunday
  season:       'Advent',
  color:        'Violet',      // liturgical color (Blue/Violet/White/Red/Green)
  isSunday:     true,
  isFestival:   false,
  festivalTitle: 'Christmas Day',  // or null
  moveableFeast: 'Ash Wednesday',  // computed feasts not in JSON, or null
  saintsDay:    'St. Stephen, Martyr',  // or null

  propers: {
    epistle:       'Rom. 13:11-14',  // or null
    gospel:        'Matt. 21:1-9',
    oldTestament:  'Jer. 23:5-8',
    collect:       'Stir up Your power...',
    introit:       '...',
    gradual:       '...',
    verse:         '...',
  },

  dailyReadings: {
    firstReading:  'Is. 61:1-11',
    secondReading: 'Luke 1:57-80',
  },

  raw: {
    sundayPropers:    [ ...rawEntries ],   // full lsb-1yr matches
    festivalPropers:  [ ...rawEntries ],   // full lsb-festivals matches
    dailyReadings:    [ ...rawEntries ],
    commemorations:   [ ...rawEntries ],
  },
}
```

---

## Liturgical colors utility

```js
import { getLiturgicalColorStyle, getAccentColor } from './lectionary/liturgicalColors';

// Full palette for the current color scheme
const { accent, background, text } = getLiturgicalColorStyle('Violet', isDark);

// Just the accent hex (for dots, badges, borders)
const hex = getAccentColor('Green');  // '#2E7D4F'
```

### Color names returned by the service

| Color    | When used                          |
|----------|------------------------------------|
| `Blue`   | Advent (LSB tradition)             |
| `Violet` | Pre-Lent, Lent                     |
| `White`  | Christmas, Easter, feasts of Christ|
| `Red`    | Pentecost, martyrs' days           |
| `Scarlet`| Palm Sunday / Holy Week            |
| `Green`  | Epiphany, Trinity season           |

---

## Week numbers reference

Week 1 = Advent 1 · Week 22 = Easter · Week 29 = Pentecost · Week 30 = Trinity Sunday · Week 57 = Last Sunday

```js
import { SUNDAYS } from './lectionary/LiturgicalService';
// SUNDAYS.ADVENT_1 === 1
// SUNDAYS.EASTER   === 22
// SUNDAYS.PENTECOST === 29
```

---

## Data sources

All JSON data comes from [stanlemon/lectionary-js](https://github.com/stanlemon/lectionary-js) (MIT license).
The calendar algorithm is a JavaScript port of the same project.

_Lectionary data belongs to the church at large throughout time._
