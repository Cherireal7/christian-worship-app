import { HYMN_RECORDS } from '../data/hymns';

export type HymnCategory = 'all' | 'worship' | 'confession' | 'prayer' | 'feast';

export type Hymn = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: Exclude<HymnCategory, 'all'>;
  lyrics: string;
  opening: string;
  verses: string[];
};

export const HYMN_CATEGORIES: Array<{ key: HymnCategory; label: string }> = [
  { key: 'all', label: 'ሁሉም መዝሙሮች' },
  { key: 'worship', label: 'የአምልኮ' },
  { key: 'confession', label: 'የእምነት' },
  { key: 'prayer', label: 'የጸሎት' },
  { key: 'feast', label: 'የበዓል' },
];

export const HYMNS: Hymn[] = HYMN_RECORDS.map(record => {
  const verses = record.lyrics
    .split(/\n\s*\n/)
    .map(block => block.replace(/\n/g, '\n').trim())
    .filter(Boolean);

  return {
    ...record,
    opening: verses[0] ?? '',
    verses,
  };
});

export function getHymnById(id: string) {
  return HYMNS.find(hymn => hymn.id === id);
}
