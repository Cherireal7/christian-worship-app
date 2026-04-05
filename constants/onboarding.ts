export type OnboardingIcon = 'cross' | 'music' | 'book';

export type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  icon: OnboardingIcon;
};

export const ONBOARDING_SLIDES: OnboardingItem[] = [
  {
    id: 'welcome',
    title: 'እንኳን በደህና መጡ',
    description:
        'መዝሙሮችን፣ ጸሎቶችን እና የእምነት ኑዛዜዎችን በማንኛውም ጊዜ ያንብቡ። ለጸጥታ እና ለተኩረት አምልኮ ተዘጋጅቷል።',
    buttonText: 'ቀጣይ',
    icon: 'cross',
  },
  {
    id: 'hymns',
    title: 'መዝሙሮች እና ቅዱስ ጽሑፎች',
    description:
        'መዝሙሮችን፣ የእምነት ኑዛዜዎችን እና ጸሎቶችን በአንድ ቦታ ያግኙ። በአምልኮ ጊዜ ለማንበብ ቀላል እና ምቹ ነው።',
    buttonText: 'ቀጣይ',
    icon: 'music',
  },
  {
    id: 'offline',
    title: 'በየትኛውም ቦታ እግዚአብሄርን ያምልኩ',
    description:
        'ያለ ኢንተርኔት መዝሙሮችን እና ጸሎቶችን ያግኙ። ይህ የአምልኮ መመሪያዎ ሁልጊዜ ከእርስዎ ጋር ነው።',
    buttonText: 'ጀምር',
    icon: 'book',
  },
];
