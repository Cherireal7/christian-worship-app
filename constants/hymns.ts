import hymnsData from '../data/hymns_amharic_structured.json';
import { buildSearchForms } from '../services/amharic-search';

export type Hymn = {
  id: string;
  number: string;
  title: string;
  chorus: string | null;
  lyrics: string;
  opening: string;
  verses: string[];
  searchOriginal: string;
  searchLatin: string;
  searchSkeleton: string;
};

type HymnJsonRecord = {
  number: number;
  title: string;
  chorus: string | null;
  verses: Array<{
    number: number;
    text: string;
  }>;
  lyrics: string;
};

function buildOpening(record: HymnJsonRecord) {
  const firstVerse = record.verses[0]?.text ?? record.lyrics;

  return firstVerse
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

export const HYMNS: Hymn[] = (hymnsData as HymnJsonRecord[]).map(record => {
  const verses = record.verses
    .map(verse => verse.text.trim())
    .filter(Boolean);
  const opening = buildOpening(record).slice(0, 2).join(' ');
  const searchSource = `${record.number} ${record.title} ${opening}`;
  const searchForms = buildSearchForms(searchSource);

  return {
    id: String(record.number),
    number: String(record.number),
    title: record.title,
    chorus: record.chorus,
    lyrics: record.lyrics,
    opening,
    verses,
    searchOriginal: searchForms.original,
    searchLatin: searchForms.latin,
    searchSkeleton: searchForms.skeleton,
  };
});

export function getHymnById(id: string) {
  return HYMNS.find(hymn => hymn.id === id);
}
