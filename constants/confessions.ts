import { CONFESSION_RECORDS } from '../data/confessions';

export type Confession = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  body: string;
};

export const CONFESSIONS: Confession[] = CONFESSION_RECORDS;

export function getConfessionById(id: string) {
  return CONFESSIONS.find(confession => confession.id === id);
}
