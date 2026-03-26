export type CalendarDayRecord = {
  id: string;
  date: string;
  title: string;
  summary: string;
  color: 'gold' | 'rose' | 'violet';
};

export const CALENDAR_DAY_RECORDS: CalendarDayRecord[] = [
  {
    id: '2026-04-07',
    date: '2026-04-07',
    title: 'የዕለቱ ቅዱስ',
    summary: 'ለወደፊት የቅዱሳን ቀን ዝርዝር የሚሞላበት ቦታ።',
    color: 'gold',
  },
  {
    id: '2026-04-12',
    date: '2026-04-12',
    title: 'የቅዱስ ሚካኤል መታሰቢያ',
    summary: 'የቀን ንባብ፣ ታሪክ እና ሥርዓተ አምልኮ መረጃ ይጨመራል።',
    color: 'rose',
  },
  {
    id: '2026-04-19',
    date: '2026-04-19',
    title: 'የዕለቱ በዓል',
    summary: 'የበዓል መረጃ እና የዕለቱ መዝሙር ማጣቀሻዎች እዚህ ይኖራሉ።',
    color: 'violet',
  },
  {
    id: '2026-04-21',
    date: '2026-04-21',
    title: 'የሐዋርያት መታሰቢያ',
    summary: 'ለዚህ ቀን የሐዋርያት ታሪክ እና የንባብ ክፍሎች ይጨመራሉ።',
    color: 'gold',
  },
  {
    id: '2026-04-22',
    date: '2026-04-22',
    title: 'የቅዱሳን ስብሰባ',
    summary: 'ለወደፊት የበዓል እና የቅዱሳን ማስታወሻ ዝርዝር ይገባል።',
    color: 'rose',
  },
  {
    id: '2026-04-23',
    date: '2026-04-23',
    title: 'የቀን ልዩ መታሰቢያ',
    summary: 'የዕለቱ ዝርዝር የአገልግሎት መረጃ እና ንባብ እዚህ ይታያል።',
    color: 'gold',
  },
  {
    id: '2026-04-26',
    date: '2026-04-26',
    title: 'የእሁድ በዓል',
    summary: 'የእሁድ በዓል መርሃ ግብር ለወደፊት በJSON መረጃ ይተካል።',
    color: 'rose',
  },
  {
    id: '2026-04-28',
    date: '2026-04-28',
    title: 'የዕለቱ ንባብ',
    summary: 'የቀን ንባቦች እና የአምልኮ መመሪያዎች ይጨመራሉ።',
    color: 'gold',
  },
];
