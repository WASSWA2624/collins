/**
 * Training Content Model
 * Validates + normalizes local offline training content.
 * File: training.model.js
 */
import { z } from 'zod';
import trainingContentJson from './data/training.content.json';

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const nonEmptyString = z.string().min(1);

const stringArraySchema = z.array(nonEmptyString).default([]);

const textBlockSchema = z
  .union([nonEmptyString, z.array(nonEmptyString).min(1)])
  .transform((value) => (Array.isArray(value) ? value.join('\n\n') : value));

const freezeStringArray = (value) => Object.freeze([...(Array.isArray(value) ? value : [])]);

const normalizeContentEntry = (value) => {
  return {
    ...value,
    order: value?.order ?? 0,
    tags: freezeStringArray(value?.tags),
    audiences: freezeStringArray(value?.audiences),
  };
};

const protocolSectionSchema = z
  .object({
    id: nonEmptyString,
    workflow: nonEmptyString.optional(),
    title: nonEmptyString,
    summary: nonEmptyString.optional(),
    body: textBlockSchema,
    audiences: stringArraySchema,
    tags: stringArraySchema,
    order: z.number().int().nonnegative(),
  })
  .passthrough()
  .transform(normalizeContentEntry);

const remoteTopicSchema = z
  .object({
    id: nonEmptyString,
    workflow: nonEmptyString.optional(),
    title: nonEmptyString,
    summary: nonEmptyString.optional(),
    body: textBlockSchema,
    audiences: stringArraySchema,
    tags: stringArraySchema,
    order: z.number().int().nonnegative().optional(),
  })
  .passthrough()
  .transform(normalizeContentEntry);

const checklistItemSchema = z
  .object({
    id: nonEmptyString,
    text: nonEmptyString,
    tags: stringArraySchema,
  })
  .passthrough()
  .transform((value) => {
    return {
      ...value,
      tags: freezeStringArray(value?.tags),
    };
  });

const checklistSchema = z
  .object({
    id: nonEmptyString,
    workflow: nonEmptyString.optional(),
    title: nonEmptyString,
    audiences: stringArraySchema,
    tags: stringArraySchema,
    items: z.array(checklistItemSchema).min(1),
    order: z.number().int().nonnegative().optional(),
  })
  .passthrough()
  .transform((value) => {
    return {
      ...normalizeContentEntry(value),
      items: Object.freeze([...(Array.isArray(value.items) ? value.items : [])]),
    };
  });

const glossaryEntrySchema = z
  .object({
    term: nonEmptyString,
    definition: nonEmptyString,
    workflow: nonEmptyString.optional(),
    audiences: stringArraySchema,
    tags: stringArraySchema,
    order: z.number().int().nonnegative().optional(),
  })
  .passthrough()
  .transform(normalizeContentEntry);

const faqEntrySchema = z
  .object({
    id: nonEmptyString,
    question: nonEmptyString,
    answer: nonEmptyString,
    workflow: nonEmptyString.optional(),
    audiences: stringArraySchema,
    tags: stringArraySchema,
    order: z.number().int().nonnegative().optional(),
  })
  .passthrough()
  .transform(normalizeContentEntry);

const referencePolicySchema = z
  .object({
    activeReferenceEndpoint: nonEmptyString.optional(),
    verifiedOnly: z.boolean().optional(),
    requiredMetadata: stringArraySchema,
    decisionSupportUse: nonEmptyString.optional(),
    excludedUse: nonEmptyString.optional(),
  })
  .passthrough()
  .transform((value) => ({
    ...value,
    requiredMetadata: freezeStringArray(value?.requiredMetadata),
  }));

const sortByOrder = (a, b) => {
  if ((a?.order ?? 0) !== (b?.order ?? 0)) return (a?.order ?? 0) - (b?.order ?? 0);
  return String(a?.id ?? a?.term ?? '').localeCompare(String(b?.id ?? b?.term ?? ''));
};

const trainingContentSchema = z
  .object({
    contentVersion: nonEmptyString,
    contentSchemaVersion: nonEmptyString,
    lastUpdated: isoDateSchema,
    safetyStatement: nonEmptyString.optional(),
    dataBoundary: nonEmptyString.optional(),
    workflows: stringArraySchema,
    referencePolicy: referencePolicySchema.optional(),
    topics: z.array(remoteTopicSchema).default([]),
    protocolSections: z.array(protocolSectionSchema).default([]),
    checklists: z.array(checklistSchema).default([]),
    glossary: z.array(glossaryEntrySchema).default([]),
    faqs: z.array(faqEntrySchema).default([]),
  })
  .passthrough()
  .transform((value) => {
    const topics = [...(Array.isArray(value.topics) ? value.topics : [])].slice();
    topics.sort(sortByOrder);

    const protocolSections = [...(Array.isArray(value.protocolSections) ? value.protocolSections : [])].slice();
    protocolSections.sort(sortByOrder);

    const checklists = [...(Array.isArray(value.checklists) ? value.checklists : [])].slice();
    checklists.sort(sortByOrder);

    const glossary = [...(Array.isArray(value.glossary) ? value.glossary : [])].slice();
    glossary.sort(sortByOrder);

    const faqs = [...(Array.isArray(value.faqs) ? value.faqs : [])].slice();
    faqs.sort(sortByOrder);

    return Object.freeze({
      ...value,
      workflows: freezeStringArray(value.workflows),
      topics: Object.freeze([...topics]),
      protocolSections: Object.freeze([...protocolSections]),
      checklists: Object.freeze([...checklists]),
      glossary: Object.freeze([...glossary]),
      faqs: Object.freeze([...faqs]),
    });
  });

const parseTrainingContent = (value) => trainingContentSchema.parse(value ?? {});
const safeParseTrainingContent = (value) => trainingContentSchema.safeParse(value ?? {});

let cachedDefaultTrainingContent = null;
const getDefaultTrainingContent = () => {
  if (cachedDefaultTrainingContent) return cachedDefaultTrainingContent;
  cachedDefaultTrainingContent = parseTrainingContent(trainingContentJson);
  return cachedDefaultTrainingContent;
};

export {
  trainingContentSchema,
  parseTrainingContent,
  safeParseTrainingContent,
  getDefaultTrainingContent,
};
