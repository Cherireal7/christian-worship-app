const fs = require('fs');
const path = require('path');

const SMALL_PATH = path.join(process.cwd(), 'data', 'catechism_small_catechism.json');
const COMMENTARY_PATH = path.join(process.cwd(), 'data', 'catechism_commentary.json');

const TOP_LEVEL_KEYS = [
  'title_am',
  'title_en',
  'description',
  'language',
  'source_file',
  'sections',
];

const SMALL_SECTION_ID_ORDER = [
  'ten_commandments',
  'apostles_creed',
  'lords_prayer',
  'holy_baptism',
  'confession',
  'sacrament_of_altar',
  'daily_prayers',
  'table_of_duties',
  'christian_questions',
  'additional_texts',
];

const SECTION_KEY_ORDER = {
  ten_commandments: [
    'order',
    'id',
    'section_am',
    'section_en',
    'instruction_am',
    'commandments',
    'conclusion',
  ],
  apostles_creed: ['order', 'id', 'section_am', 'section_en', 'instruction_am', 'articles'],
  lords_prayer: [
    'order',
    'id',
    'section_am',
    'section_en',
    'instruction_am',
    'full_prayer_text',
    'introduction',
    'petitions',
    'conclusion',
  ],
  holy_baptism: ['order', 'id', 'section_am', 'section_en', 'instruction_am', 'parts'],
  confession: ['order', 'id', 'section_am', 'section_en', 'subsections', 'full_content'],
  sacrament_of_altar: [
    'order',
    'id',
    'section_am',
    'section_en',
    'instruction_am',
    'subsections',
    'full_content',
  ],
  daily_prayers: [
    'order',
    'id',
    'section_am',
    'section_en',
    'morning_prayer',
    'evening_prayer',
    'asking_blessing',
    'returning_thanks',
    'full_content',
  ],
  table_of_duties: ['order', 'id', 'section_am', 'section_en', 'duties'],
  christian_questions: ['order', 'id', 'section_am', 'section_en', 'note', 'questions'],
  additional_texts: [
    'order',
    'id',
    'section_am',
    'section_en',
    'old_testament_books',
    'new_testament_books',
    'church_calendar_entries',
    'full_content',
  ],
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function orderedObject(source, priorityKeys) {
  const out = {};
  const used = new Set();

  for (const key of priorityKeys) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      out[key] = source[key];
      used.add(key);
    }
  }

  const extras = Object.keys(source)
    .filter(key => !used.has(key))
    .sort((a, b) => a.localeCompare(b));

  for (const key of extras) {
    out[key] = source[key];
  }

  return out;
}

function normalizeWrappedParagraph(paragraph) {
  const lines = paragraph
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return lines[0] ?? '';
  }

  const isListLine = line => /^(\d+[.)።]|[-•*])\s*/.test(line.trim());

  const shouldKeepLineBreak = (prev, curr) => {
    const previous = prev.trim();
    const current = curr.trim();

    if (!previous || !current) {
      return true;
    }

    if (isListLine(previous) || isListLine(current)) {
      return true;
    }

    if (/[፡:;፤]$/.test(previous)) {
      // Page-wrap artifacts often split numeric references like "24፡\n14".
      if (/^\d/.test(current)) {
        return false;
      }

      if (previous.length <= 36) {
        return true;
      }
    }

    if (/[?؟]$/.test(previous)) {
      return true;
    }

    // Preserve likely short headings followed by body text.
    if (previous.length <= 24 && current.length >= 28) {
      return true;
    }

    return false;
  };

  let merged = lines[0];

  for (let i = 1; i < lines.length; i += 1) {
    if (shouldKeepLineBreak(lines[i - 1], lines[i])) {
      merged += `\n${lines[i]}`;
    } else {
      merged += ` ${lines[i]}`;
    }
  }

  return merged;
}

function normalizeText(value) {
  let text = value.replace(/\u00A0/g, ' ').replace(/\r\n?/g, '\n');

  // Repair common scan/OCR line-break artifacts in references.
  text = text.replace(/([0-9፩-፱])፡\n([0-9፩-፱])/g, '$1፡$2');
  text = text.replace(/([0-9])-\n([0-9])/g, '$1-$2');
  text = text.replace(/\n([፣።,:;])/g, '$1');

  text = text.replace(/[ \t]+\n/g, '\n');
  text = text.replace(/\n[ \t]+/g, '\n');
  text = text.replace(/[ \t]{2,}/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');

  text = text
    .split('\n\n')
    .map(normalizeWrappedParagraph)
    .join('\n\n');

  text = text.replace(/[ ]{2,}/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

function normalizeDeep(value) {
  if (typeof value === 'string') {
    return normalizeText(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeDeep);
  }

  if (isPlainObject(value)) {
    const out = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = normalizeDeep(item);
    }
    return out;
  }

  return value;
}

function normalizeQuestionNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : value;
}

function normalizeCollection(collection, keyOrder) {
  if (!Array.isArray(collection)) {
    return [];
  }

  return collection.map((item, index) => {
    if (!isPlainObject(item)) {
      return item;
    }

    const enriched = { ...item, order: index + 1 };
    return orderedObject(enriched, ['order', ...keyOrder]);
  });
}

function normalizeSmallSection(section, order) {
  const normalized = { ...section, order };

  if (Array.isArray(normalized.commandments)) {
    normalized.commandments = normalizeCollection(normalized.commandments, [
      'name_am',
      'name_en',
      'verse',
      'explanation',
    ]);
  }

  if (Array.isArray(normalized.articles)) {
    normalized.articles = normalizeCollection(normalized.articles, [
      'name_am',
      'subtitle_am',
      'name_en',
      'subtitle_en',
      'text',
      'explanation',
    ]);
  }

  if (Array.isArray(normalized.petitions)) {
    normalized.petitions = normalizeCollection(normalized.petitions, [
      'name_am',
      'subtitle_am',
      'name_en',
      'subtitle_en',
      'text',
      'explanation',
    ]);
  }

  if (Array.isArray(normalized.parts)) {
    normalized.parts = normalizeCollection(normalized.parts, [
      'part_am',
      'part_en',
      'question_en',
      'content',
    ]);
  }

  if (Array.isArray(normalized.subsections)) {
    normalized.subsections = normalizeCollection(normalized.subsections, [
      'question_am',
      'question_en',
      'content',
    ]);
  }

  if (Array.isArray(normalized.duties)) {
    normalized.duties = normalizeCollection(normalized.duties, [
      'title_am',
      'title_en',
      'content',
    ]);
  }

  if (Array.isArray(normalized.questions)) {
    normalized.questions = normalizeCollection(normalized.questions, ['number', 'content']);
  }

  if (isPlainObject(normalized.introduction)) {
    normalized.introduction = orderedObject(normalized.introduction, [
      'title_am',
      'title_en',
      'explanation',
    ]);
  }

  const prayerObjectKeys = [
    'morning_prayer',
    'evening_prayer',
    'asking_blessing',
    'returning_thanks',
  ];

  for (const key of prayerObjectKeys) {
    if (isPlainObject(normalized[key])) {
      normalized[key] = orderedObject(normalized[key], ['title_am', 'title_en', 'content']);
    }
  }

  if (isPlainObject(normalized.conclusion)) {
    normalized.conclusion = orderedObject(normalized.conclusion, [
      'title_am',
      'title_en',
      'content',
    ]);
  }

  const keyOrder = SECTION_KEY_ORDER[normalized.id] ?? ['order', 'id', 'section_am', 'section_en'];
  return orderedObject(normalized, keyOrder);
}

function normalizeSmallCatechism() {
  const raw = JSON.parse(fs.readFileSync(SMALL_PATH, 'utf8'));
  const cleaned = normalizeDeep(raw);
  const sections = Array.isArray(cleaned.sections) ? cleaned.sections : [];

  const sectionById = new Map(sections.map(section => [section.id, section]));
  const consumedIds = new Set();
  const orderedSections = [];

  for (const id of SMALL_SECTION_ID_ORDER) {
    const section = sectionById.get(id);
    if (!section) {
      continue;
    }

    consumedIds.add(id);
    orderedSections.push(normalizeSmallSection(section, orderedSections.length + 1));
  }

  for (const section of sections) {
    if (consumedIds.has(section.id)) {
      continue;
    }

    orderedSections.push(normalizeSmallSection(section, orderedSections.length + 1));
  }

  const out = orderedObject({ ...cleaned, sections: orderedSections }, TOP_LEVEL_KEYS);
  fs.writeFileSync(SMALL_PATH, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
}

function normalizeCommentary() {
  const raw = JSON.parse(fs.readFileSync(COMMENTARY_PATH, 'utf8'));
  const cleaned = normalizeDeep(raw);
  const sections = Array.isArray(cleaned.sections) ? cleaned.sections : [];

  const normalizedSections = sections.map((section, sectionIndex) => {
    const questions = Array.isArray(section.questions) ? section.questions : [];

    const normalizedQuestions = questions.map((question, questionIndex) => {
      const object = isPlainObject(question) ? question : {};
      const normalized = {
        ...object,
        order: questionIndex + 1,
        number: normalizeQuestionNumber(object.number),
      };

      return orderedObject(normalized, ['order', 'number', 'question', 'answer']);
    });

    const normalizedSection = {
      ...section,
      order: sectionIndex + 1,
      total_questions: normalizedQuestions.length,
      questions: normalizedQuestions,
    };

    return orderedObject(normalizedSection, [
      'order',
      'id',
      'section_am',
      'section_en',
      'note',
      'total_questions',
      'questions',
    ]);
  });

  const out = orderedObject({ ...cleaned, sections: normalizedSections }, TOP_LEVEL_KEYS);
  fs.writeFileSync(COMMENTARY_PATH, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
}

normalizeSmallCatechism();
normalizeCommentary();

console.log('Catechism data normalized successfully.');
