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

const TRAINING_WORKFLOWS = Object.freeze([
  'home',
  'admit',
  'tracking',
  'abg-vent-update',
  'dataset-capture',
  'review-queue',
  'dashboard',
  'settings',
]);

const TRAINING_DEFAULT_LIMIT = 20;

const TRAINING_ROLE_AUDIENCES = Object.freeze({
  platform_admin: Object.freeze(['platform_admin', 'facility_admin', 'reviewer', 'research_governance', 'model_governance', 'clinical']),
  facility_admin: Object.freeze(['facility_admin', 'reviewer', 'clinical']),
  clinician: Object.freeze(['clinical']),
  icu_nurse: Object.freeze(['clinical']),
  specialist_reviewer: Object.freeze(['reviewer', 'clinical']),
  research_governance_officer: Object.freeze(['research_governance', 'reviewer']),
  model_governance_officer: Object.freeze(['model_governance']),
  read_only_reviewer: Object.freeze(['reviewer']),
});

const FORBIDDEN_TRAINING_WORDING = Object.freeze([
  Object.freeze({
    code: 'EXACT_VENTILATOR_ORDER',
    pattern: /\b(set|increase|decrease|change)\s+(the\s+)?(ventilator|peep|fio2|tidal volume|respiratory rate|pressure support)\s+(to|at)\s+\d/i,
  }),
  Object.freeze({
    code: 'AUTONOMOUS_DIAGNOSIS',
    pattern: /\b(diagnose|diagnoses|diagnosed)\b/i,
  }),
  Object.freeze({
    code: 'PRESCRIPTION_LANGUAGE',
    pattern: /\b(prescribe|prescribes|prescribed|prescription)\b/i,
  }),
  Object.freeze({
    code: 'MANDATORY_AIRWAY_ACTION',
    pattern: /\b(must|should)\s+(intubate|extubate|paralyze|sedate)\b/i,
  }),
  Object.freeze({
    code: 'DOSE_OR_TREATMENT_ORDER',
    pattern: /\b(give|administer|start)\s+\d+(\.\d+)?\s*(mg|mcg|ml|units?|iu|mmol)\b/i,
  }),
]);

const isNonEmptyString = (value) => typeof value === 'string' && value.trim();

const asStringArray = (value) => (Array.isArray(value) ? value.filter((v) => isNonEmptyString(v)) : []);

const unique = (values) => [...new Set(values.filter(Boolean))];

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

const normalizeRole = (role) => normalizeTrainingQuery(role).replace(/-/g, '_');

const getTrainingRoleAudiences = (roles = []) => {
  const roleList = Array.isArray(roles) ? roles : [roles];
  const audiences = new Set(['all']);

  roleList.map(normalizeRole).filter(Boolean).forEach((role) => {
    audiences.add(role);
    (TRAINING_ROLE_AUDIENCES[role] || []).forEach((audience) => audiences.add(audience));
  });

  return audiences;
};

const isTrainingAudienceVisible = (item, roles = []) => {
  const audiences = asStringArray(item?.audiences).map((audience) => normalizeTrainingQuery(audience));
  if (audiences.length === 0 || audiences.includes('all')) return true;

  const roleAudiences = getTrainingRoleAudiences(roles);
  return audiences.some((audience) => roleAudiences.has(audience));
};

const matchesWorkflowFilter = (item, workflow) => {
  const normalizedWorkflow = normalizeTrainingQuery(workflow);
  if (!normalizedWorkflow) return true;
  return normalizeTrainingQuery(item?.workflow) === normalizedWorkflow;
};

const normalizedTagsFor = ({ tags, workflow, audiences }) =>
  Object.freeze(unique([
    ...asStringArray(tags).map((t) => normalizeTrainingQuery(t)),
    normalizeTrainingQuery(workflow),
    ...asStringArray(audiences).map((audience) => normalizeTrainingQuery(audience)),
  ]));

const appendTrainingDocument = (docs, entry, type, options = {}) => {
  if (!entry || !isTrainingAudienceVisible(entry, options.roles) || !matchesWorkflowFilter(entry, options.workflow)) {
    return;
  }

  const id = entry?.id ?? entry?.term ?? null;
  const title = entry?.title ?? entry?.term ?? entry?.question ?? null;
  const contentText = [entry?.summary, entry?.body, entry?.definition, entry?.answer]
    .filter(isNonEmptyString)
    .join(' ');

  docs.push(
    Object.freeze({
      type,
      id,
      title,
      body: contentText || null,
      workflow: entry?.workflow ?? null,
      audiences: Object.freeze(asStringArray(entry?.audiences)),
      tags: normalizedTagsFor(entry),
    })
  );
};

const buildTrainingDocuments = (content = getDefaultTrainingContent(), options = {}) => {
  const docs = [];

  const remoteTopics = Array.isArray(content?.topics) ? content.topics : [];
  remoteTopics.forEach((s) => appendTrainingDocument(docs, s, TRAINING_DOC_TYPES.protocol, options));

  const protocolSections = Array.isArray(content?.protocolSections) ? content.protocolSections : [];
  protocolSections.forEach((s) => appendTrainingDocument(docs, s, TRAINING_DOC_TYPES.protocol, options));

  const checklists = Array.isArray(content?.checklists) ? content.checklists : [];
  checklists.forEach((c) => {
    if (!isTrainingAudienceVisible(c, options.roles) || !matchesWorkflowFilter(c, options.workflow)) return;

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
        workflow: c?.workflow ?? null,
        audiences: Object.freeze(asStringArray(c?.audiences)),
        tags: normalizedTagsFor({ tags, workflow: c?.workflow, audiences: c?.audiences }),
      })
    );
  });

  const glossary = Array.isArray(content?.glossary) ? content.glossary : [];
  glossary.forEach((g) => appendTrainingDocument(docs, g, TRAINING_DOC_TYPES.glossary, options));

  const faqs = Array.isArray(content?.faqs) ? content.faqs : [];
  faqs.forEach((f) => appendTrainingDocument(docs, f, TRAINING_DOC_TYPES.faq, options));

  return Object.freeze([...docs]);
};

const scoreDocument = ({ doc, tokens, phrase }) => {
  const title = normalizeTrainingQuery(doc?.title ?? '');
  const body = normalizeTrainingQuery(doc?.body ?? '');
  const workflow = normalizeTrainingQuery(doc?.workflow ?? '');
  const tags = Array.isArray(doc?.tags) ? doc.tags : [];

  if (!title && !body && !workflow && tags.length === 0) return 0;

  let score = 0;
  if (phrase && title.includes(phrase)) score += 6;
  if (phrase && workflow.includes(phrase)) score += 4;
  if (phrase && body.includes(phrase)) score += 2;

  tokens.forEach((t) => {
    if (!t) return;
    if (title.includes(t)) score += 3;
    if (workflow.includes(t)) score += 2;
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
  roles,
  workflow,
  limit = TRAINING_DEFAULT_LIMIT,
} = {}) => {
  const q = normalizeTrainingQuery(query);
  if (!q) return [];

  const docs = buildTrainingDocuments(content, { roles, workflow });
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
        workflow: doc.workflow,
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

const collectTrainingStrings = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectTrainingStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectTrainingStrings);
  return [];
};

const findForbiddenTrainingWording = (content = getDefaultTrainingContent()) => {
  const strings = collectTrainingStrings(content);
  return strings.flatMap((text) =>
    FORBIDDEN_TRAINING_WORDING
      .filter(({ pattern }) => pattern.test(text))
      .map(({ code }) => ({ code, text }))
  );
};

export {
  TRAINING_DOC_TYPES,
  TRAINING_WORKFLOWS,
  TRAINING_DEFAULT_LIMIT,
  TRAINING_ROLE_AUDIENCES,
  FORBIDDEN_TRAINING_WORDING,
  normalizeTrainingQuery,
  splitQueryTokens,
  getTrainingRoleAudiences,
  isTrainingAudienceVisible,
  buildTrainingDocuments,
  searchTrainingContent,
  findForbiddenTrainingWording,
};
