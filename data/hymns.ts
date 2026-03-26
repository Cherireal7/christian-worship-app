export type HymnRecord = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'worship' | 'confession' | 'prayer' | 'feast';
  lyrics: string;
};

const PLACEHOLDER_LYRICS = `አምላኬ ሆይ ክብር ለአንተ
በሰማይ እና በምድር የምትነግሥ
ብርሃንህ ልቤን አብራ
መንገዴንም አቅና።

ጌታ ኢየሱስ ሆይ መድኃኒቴ
በፍቅርህ አዳንከኝ
በሰላምህ አኑረኝ
እስከ ዘለዓለም ከአንተ ጋር።

ክብር ለአብ
ክብር ለወልድ
ክብር ለመንፈስ ቅዱስ
አሁን እና ለዘለዓለም አሜን።

አምላኬ ሆይ ክብር ለአንተ
በሰማይ እና በምድር የምትነግሥ
ብርሃንህ ልቤን አብራ
መንገዴንም አቅና።

አምላኬ ሆይ ክብር ለአንተ
በሰማይ እና በምድር የምትነግሥ
ብርሃንህ ልቤን አብራ
መንገዴንም አቅና።`;

export const HYMN_RECORDS: HymnRecord[] = [
  {
    id: 'abatachin-hoy',
    number: '01',
    title: 'አባታችን ሆይ',
    subtitle: 'Opening worship hymn',
    category: 'worship',
    lyrics: PLACEHOLDER_LYRICS,
  },
  {
    id: 'igziabhier-yimesgen',
    number: '02',
    title: 'እግዚአብሔር ይመስገን',
    subtitle: 'Song of praise',
    category: 'worship',
    lyrics: PLACEHOLDER_LYRICS,
  },
  {
    id: 'silaset-tsnatsen',
    number: '03',
    title: 'ሥላሴ ትንግሥትን',
    subtitle: 'Confession hymn',
    category: 'confession',
    lyrics: PLACEHOLDER_LYRICS,
  },
  {
    id: 'tselot-wede-samayat',
    number: '04',
    title: 'የጸሎት ድምፅ',
    subtitle: 'Prayer hymn',
    category: 'prayer',
    lyrics: PLACEHOLDER_LYRICS,
  },
  {
    id: 'beale-meskel',
    number: '05',
    title: 'የመስቀል ክብር',
    subtitle: 'Feast hymn',
    category: 'feast',
    lyrics: PLACEHOLDER_LYRICS,
  },
  {
    id: 'wongel-berhan',
    number: '06',
    title: 'የወንጌል ብርሃን',
    subtitle: 'Word and proclamation',
    category: 'confession',
    lyrics: PLACEHOLDER_LYRICS,
  },
  {
    id: 'selam-lebetekrestian',
    number: '07',
    title: 'ሰላም ለቤተ ክርስቲያን',
    subtitle: 'Closing hymn',
    category: 'prayer',
    lyrics: PLACEHOLDER_LYRICS,
  },
];
