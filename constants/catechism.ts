import catechismCommentaryData from '../data/catechism_commentary.json';
import smallCatechismData from '../data/catechism_small_catechism.json';

export type CatechismSection = {
  id: string;
  section_am: string;
  section_en: string;
  [key: string]: unknown;
};

type SmallCatechismPayload = {
  title_am: string;
  title_en: string;
  description: string;
  language: string;
  source_file: string;
  sections: CatechismSection[];
};

export type CatechismCommentaryQuestion = {
  number: number;
  question: string;
  answer: string;
};

export type CatechismCommentarySection = {
  id: string;
  section_am: string;
  section_en: string;
  note?: string;
  total_questions?: number;
  questions: CatechismCommentaryQuestion[];
};

type CatechismCommentaryPayload = {
  title_am: string;
  title_en: string;
  description: string;
  language: string;
  source_file: string;
  sections: CatechismCommentarySection[];
};

export const SMALL_CATECHISM = smallCatechismData as SmallCatechismPayload;
export const SMALL_CATECHISM_SECTIONS = SMALL_CATECHISM.sections;

const COMMENTARY_PAYLOAD = catechismCommentaryData as CatechismCommentaryPayload;

const EMPTY_COMMENTARY: CatechismCommentarySection = {
  id: 'commentary',
  section_am: 'ማብራሪያ',
  section_en: 'Commentary',
  note: '',
  total_questions: 0,
  questions: [],
};

export const CATECHISM_COMMENTARY =
  COMMENTARY_PAYLOAD.sections[0] ?? EMPTY_COMMENTARY;

export function getSmallCatechismSectionById(id: string) {
  return SMALL_CATECHISM_SECTIONS.find(section => section.id === id);
}
