type SearchForms = {
  original: string;
  latin: string;
  skeleton: string;
};

const ORDER_SUFFIXES = ['a', 'u', 'i', 'a', 'e', '', 'o'];

const ROW_ROOTS: Array<{ start: string; root: string }> = [
  { start: 'ሀ', root: 'h' },
  { start: 'ለ', root: 'l' },
  { start: 'ሐ', root: 'h' },
  { start: 'መ', root: 'm' },
  { start: 'ሠ', root: 's' },
  { start: 'ረ', root: 'r' },
  { start: 'ሰ', root: 's' },
  { start: 'ሸ', root: 'sh' },
  { start: 'ቀ', root: 'q' },
  { start: 'በ', root: 'b' },
  { start: 'ተ', root: 't' },
  { start: 'ቸ', root: 'ch' },
  { start: 'ኀ', root: 'h' },
  { start: 'ነ', root: 'n' },
  { start: 'ኘ', root: 'ny' },
  { start: 'ከ', root: 'k' },
  { start: 'ኸ', root: 'kh' },
  { start: 'ወ', root: 'w' },
  { start: 'ዘ', root: 'z' },
  { start: 'ዠ', root: 'zh' },
  { start: 'የ', root: 'y' },
  { start: 'ደ', root: 'd' },
  { start: 'ጀ', root: 'j' },
  { start: 'ገ', root: 'g' },
  { start: 'ጠ', root: 't' },
  { start: 'ጨ', root: 'ch' },
  { start: 'ጰ', root: 'p' },
  { start: 'ጸ', root: 'ts' },
  { start: 'ፀ', root: 'ts' },
  { start: 'ፈ', root: 'f' },
  { start: 'ፐ', root: 'p' },
];

const transliterationMap = new Map<string, string>();

for (const row of ROW_ROOTS) {
  const startCode = row.start.charCodeAt(0);

  ORDER_SUFFIXES.forEach((suffix, index) => {
    transliterationMap.set(String.fromCharCode(startCode + index), `${row.root}${suffix}`);
  });
}

[
  ['አ', 'a'],
  ['ኡ', 'u'],
  ['ኢ', 'i'],
  ['ኣ', 'a'],
  ['ኤ', 'e'],
  ['እ', 'e'],
  ['ኦ', 'o'],
  ['ዐ', 'a'],
  ['ዑ', 'u'],
  ['ዒ', 'i'],
  ['ዓ', 'a'],
  ['ዔ', 'e'],
  ['ዕ', 'e'],
  ['ዖ', 'o'],
  ['ሟ', 'mwa'],
  ['ሯ', 'rwa'],
  ['ሷ', 'swa'],
  ['ቈ', 'qwa'],
  ['ቊ', 'qwi'],
  ['ቋ', 'qwa'],
  ['ቌ', 'qwe'],
  ['ቍ', 'qw'],
  ['ቘ', 'qwa'],
  ['ኋ', 'hwa'],
  ['ኰ', 'kwa'],
  ['ኲ', 'kwi'],
  ['ኳ', 'kwa'],
  ['ኴ', 'kwe'],
  ['ዄ', 'khwe'],
  ['ዅ', 'khw'],
  ['ዋ', 'wa'],
  ['ኗ', 'nwa'],
  ['ዧ', 'jwa'],
  ['ዷ', 'dwa'],
  ['ጐ', 'gwa'],
  ['ጒ', 'gwi'],
  ['ጓ', 'gwa'],
  ['ጔ', 'gwe'],
  ['ጕ', 'gw'],
  ['ጧ', 'twa'],
  ['፩', '1'],
  ['፡', ' '],
  ['።', ' '],
  ['፣', ' '],
  ['፤', ' '],
  ['፥', ' '],
  ['፦', ' '],
].forEach(([character, latin]) => {
  transliterationMap.set(character, latin);
});

function transliterateAmharic(text: string) {
  return Array.from(text)
    .map(character => transliterationMap.get(character) ?? character)
    .join('');
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\u1200-\u137f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildLatinSkeleton(value: string) {
  return value
    .replace(/[aeiou]+/g, '')
    .replace(/hh+/g, 'h')
    .replace(/ss+/g, 's')
    .replace(/tt+/g, 't')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSearchForms(text: string): SearchForms {
  const original = normalizeSearchText(text);
  const latin = normalizeSearchText(transliterateAmharic(text));
  const skeleton = buildLatinSkeleton(latin);

  return {
    original,
    latin,
    skeleton,
  };
}
