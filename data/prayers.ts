export type PrayerRecord = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
};

export const PRAYER_RECORDS: PrayerRecord[] = [
  {
    id: 'morning-prayer',
    title: 'የጠዋት ጸሎት',
    subtitle: 'Morning Prayer',
    body: `አምላኬ ሆይ ዛሬን በሰላም አስጀምረኝ።
ቃልህን በልቤ ውስጥ አጽና
እግሮቼን በመንገድህ መራኝ።
በሥራዬ ሁሉ ክብርህ ይታይ።
አሜን።`,
  },
  {
    id: 'before-eating',
    title: 'ከምግብ በፊት ጸሎት',
    subtitle: 'Prayer Before Eating',
    body: `ጌታ ሆይ ይህን ምግብ ባርክ።
ለሰጠኸን ቸርነትህን እናመሰግናለን።
በሰውነታችንና በነፍሳችን ጥንካሬ አድርገው።
አሜን።`,
  },
  {
    id: 'before-sleeping',
    title: 'ከመተኛት በፊት ጸሎት',
    subtitle: 'Prayer Before Sleeping',
    body: `አባታችን ሆይ ዛሬን በጸጋህ አሳለፍከን።
በሌሊቱ ሁሉ ከክፉ ጠብቀን።
በሰላም አሳርፈን
በነጋው ደግሞ ለምስጋና አንሣን።`,
  },
  {
    id: 'for-forgiveness',
    title: 'የንስሐ ጸሎት',
    subtitle: 'Prayer for Forgiveness',
    body: `ጌታ ሆይ በፊትህ ኃጢአቴን እመስክራለሁ።
በምሕረትህ ይቅር በለኝ።
ልቤን አንጻ
በእውነትህም ውስጥ አጽናኝ።`,
  },
  {
    id: 'for-the-sick',
    title: 'ለታመመ ጸሎት',
    subtitle: 'Prayer for the Sick',
    body: `የሕይወት ጌታ ሆይ
ሕመምተኛውን በእጅህ እንደገና አበርታ።
ሰውነቱን ፈውስ
ልቡንም በተስፋ ሙላ።
አሜን።`,
  },
  {
    id: 'thanksgiving-prayer',
    title: 'የምስጋና ጸሎት',
    subtitle: 'Thanksgiving Prayer',
    body: `እግዚአብሔር ሆይ ስለ ቸርነትህ እናመሰግንሃለን።
በየቀኑ ስለ ምሕረትህ እና ስለ ጥበቃህ ክብር እንሰጥሃለን።
እኛን በፍቅርህ ውስጥ አኑረን።`,
  },
  {
    id: 'to-virgin-mary',
    title: 'የእመቤታችን ጸሎት',
    subtitle: 'Prayer to the Virgin Mary',
    body: `እመቤታችን ሆይ በጸጋህ ተሸፍነናል።
ለልጅሽ በፍቅር ምልጃ አቅርቢልን።
በእምነት አጽናን
በሰላምም አስመራን።`,
  },
];
