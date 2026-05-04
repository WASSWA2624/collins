/**
 * Training Rules
 * Pure search/filter helpers over training content (offline).
 * File: training.rules.js
 */
import { getDefaultTrainingContent } from './training.model';
 
const normalizeTrainingQuery = (query) => {
  if (typeof query !== 'string') return '';
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
};
 
const splitQueryTokens = (query) => {
  const normalized = normalizeTrainingQuery(query);
  if (!normalized) return [];
  const parts = normalized.split(' ').map((p) => p.trim()).filter(Boolean);
  const out = [];
  const seen = new Set();
  parts.forEach((p) => {
    if (seen.has(p)) return;
    seen.add(p);
    out.push(p);
  });
  return out;
};
 
const TRAINING_DOC_TYPES = Object.freeze({
  protocol: 'protocol',
  checklist: 'checklist',
  glossary: 'glossary',
  faq: 'faq',
});
 
const TRAINING_DEFAULT_LIMIT = 20;
 
const isNonEmptyString = (value) => typeof value === 'string' && value.trim();
 
const asStringArray = (value) => (Array.isArray(value) ? value.filter((v) => isNonEmptyString(v)) : []);
 
const normalizeTypeFilter = (types) => {
  const list = asStringArray(types).map((t) => String(t).trim().toLowerCase());
  if (list.length === 0) return null;
  return new Set(list);
};
 
const normalizeTagFilter = (tags) => {
  const list = asStringArray(tags).map((t) => normalizeTrainingQuery(t));
  if (list.length === 0) return null;
  return new Set(list);
};
 
const buildTrainingDocuments = (content = getDefaultTrainingContent()) => {
  const docs = [];
 
  const protocolSections = Array.isArray(content?.protocolSections) ? content.protocolSections : [];
  protocolSections.forEach((s) => {
    docs.push(
      Object.freeze({
        type: TRAINING_DOC_TYPES.protocol,
        id: s?.id ?? null,
        title: s?.title ?? null,
        body: s?.body ?? null,
        tags: Object.freeze(asStringArray(s?.tags).map((t) => normalizeTrainingQuery(t))),
      })
    );
  });
 
  const checklists = Array.isArray(content?.checklists) ? content.checklists : [];
  checklists.forEach((c) => {
    const itemText = Array.isArray(c?.items) ? c.items.map((i) => i?.text).filter(isNonEmptyString).join(' ') : '';
    const tags = [
      ...asStringArray(c?.tags),
      ...(Array.isArray(c?.items) ? c.items.flatMap((i) => asStringArray(i?.tags)) : []),
    ];
 
    docs.push(
      Object.freeze({
        type: TRAINING_DOC_TYPES.checklist,
        id: c?.id ?? null,
        title: c?.title ?? null,
        body: itemText || null,
        tags: Object.freeze(tags.map((t) => normalizeTrainingQuery(t)).filter(Boolean)),
      })
    );
  });
 
  const glossary = Array.isArray(content?.glossary) ? content.glossary : [];
  glossary.forEach((g) => {
    docs.push(
      Object.freeze({
        type: TRAINING_DOC_TYPES.glossary,
        id: g?.term ?? null,
        title: g?.term ?? null,
        body: g?.definition ?? null,
        tags: Object.freeze(asStringArray(g?.tags).map((t) => normalizeTrainingQuery(t))),
      })
    );
  });
 
  const faqs = Array.isArray(content?.faqs) ? content.faqs : [];
  faqs.forEach((f) => {
    docs.push(
      Object.freeze({
        type: TRAINING_DOC_TYPES.faq,
        id: f?.id ?? null,
        title: f?.question ?? null,
        body: f?.answer ?? null,
        tags: Object.freeze(asStringArray(f?.tags).map((t) => normalizeTrainingQuery(t))),
      })
    );
  });
 
  return Object.freeze([...docs]);
};
 
const scoreDocument = ({ doc, tokens, phrase }) => {
  const title = normalizeTrainingQuery(doc?.title ?? '');
  const body = normalizeTrainingQuery(doc?.body ?? '');
  const tags = Array.isArray(doc?.tags) ? doc.tags : [];
 
  if (!title && !body && tags.length === 0) return 0;
 
  let score = 0;
  if (phrase && title.includes(phrase)) score += 6;
  if (phrase && body.includes(phrase)) score += 2;
 
  tokens.forEach((t) => {
    if (!t) return;
    if (title.includes(t)) score += 3;
    if (body.includes(t)) score += 1;
    if (tags.includes(t)) score += 2;
  });
 
  return score;
};
 
const matchesTagFilter = ({ docTags, requiredTags }) => {
  if (!requiredTags || requiredTags.size === 0) return true;
  const tags = Array.isArray(docTags) ? docTags : [];
  return tags.some((t) => requiredTags.has(t));
};
 
const searchTrainingContent = ({
  content,
  query,
  types,
  tags,
  limit = TRAINING_DEFAULT_LIMIT,
} = {}) => {
  const q = normalizeTrainingQuery(query);
  if (!q) return [];
 
  const docs = buildTrainingDocuments(content);
  const tokens = splitQueryTokens(q);
  const phrase = q;
 
  const typeSet = normalizeTypeFilter(types);
  const tagSet = normalizeTagFilter(tags);
 
  const effectiveLimit = Number.isInteger(limit) && limit > 0 ? limit : TRAINING_DEFAULT_LIMIT;
 
  const scored = docs
    .filter((doc) => {
      if (!doc) return false;
      if (!isNonEmptyString(doc.type) || !isNonEmptyString(doc.id)) return false;
      if (typeSet && !typeSet.has(String(doc.type).toLowerCase())) return false;
      if (!matchesTagFilter({ docTags: doc.tags, requiredTags: tagSet })) return false;
      return true;
    })
    .map((doc) => {
      const score = scoreDocument({ doc, tokens, phrase });
      return Object.freeze({
        type: doc.type,
        id: doc.id,
        title: doc.title,
        score,
      });
    })
    .filter((m) => m.score > 0);
 
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.type !== b.type) return String(a.type).localeCompare(String(b.type));
    return String(a.id).localeCompare(String(b.id));
  });
 
  return scored.slice(0, effectiveLimit);
};
 
export {
  TRAINING_DOC_TYPES,
  TRAINING_DEFAULT_LIMIT,
  normalizeTrainingQuery,
  splitQueryTokens,
  buildTrainingDocuments,
  searchTrainingContent,
};

