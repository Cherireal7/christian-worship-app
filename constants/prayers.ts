import { PRAYER_RECORDS } from '../data/prayers';

export type Prayer = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
};

export const PRAYERS: Prayer[] = PRAYER_RECORDS;

export function getPrayerById(id: string) {
  return PRAYERS.find(prayer => prayer.id === id);
}
