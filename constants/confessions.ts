import confessionsData from '../data/confessions.json';

export type Confession = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  body: string;
};

export const CONFESSIONS: Confession[] = confessionsData as Confession[];

export function getConfessionById(id: string) {
  return CONFESSIONS.find(confession => confession.id === id);
}
