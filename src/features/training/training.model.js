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
 
const protocolSectionSchema = z
  .object({
    id: nonEmptyString,
    title: nonEmptyString,
    body: nonEmptyString,
    tags: stringArraySchema,
    order: z.number().int().nonnegative(),
  })
  .passthrough()
  .transform((value) => {
    return {
      ...value,
      tags: Object.freeze([...(Array.isArray(value.tags) ? value.tags : [])]),
    };
  });
 
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
      tags: Object.freeze([...(Array.isArray(value.tags) ? value.tags : [])]),
    };
  });
 
const checklistSchema = z
  .object({
    id: nonEmptyString,
    title: nonEmptyString,
    tags: stringArraySchema,
    items: z.array(checklistItemSchema).min(1),
  })
  .passthrough()
  .transform((value) => {
    return {
      ...value,
      tags: Object.freeze([...(Array.isArray(value.tags) ? value.tags : [])]),
      items: Object.freeze([...(Array.isArray(value.items) ? value.items : [])]),
    };
  });
 
const glossaryEntrySchema = z
  .object({
    term: nonEmptyString,
    definition: nonEmptyString,
    tags: stringArraySchema,
  })
  .passthrough()
  .transform((value) => {
    return {
      ...value,
      tags: Object.freeze([...(Array.isArray(value.tags) ? value.tags : [])]),
    };
  });
 
const faqEntrySchema = z
  .object({
    id: nonEmptyString,
    question: nonEmptyString,
    answer: nonEmptyString,
    tags: stringArraySchema,
  })
  .passthrough()
  .transform((value) => {
    return {
      ...value,
      tags: Object.freeze([...(Array.isArray(value.tags) ? value.tags : [])]),
    };
  });
 
const trainingContentSchema = z
  .object({
    contentVersion: nonEmptyString,
    contentSchemaVersion: nonEmptyString,
    lastUpdated: isoDateSchema,
    protocolSections: z.array(protocolSectionSchema).default([]),
    checklists: z.array(checklistSchema).default([]),
    glossary: z.array(glossaryEntrySchema).default([]),
    faqs: z.array(faqEntrySchema).default([]),
  })
  .passthrough()
  .transform((value) => {
    const protocolSections = [...(Array.isArray(value.protocolSections) ? value.protocolSections : [])].slice();
    protocolSections.sort((a, b) => {
      if ((a?.order ?? 0) !== (b?.order ?? 0)) return (a?.order ?? 0) - (b?.order ?? 0);
      return String(a?.id ?? '').localeCompare(String(b?.id ?? ''));
    });
 
    return Object.freeze({
      ...value,
      protocolSections: Object.freeze([...protocolSections]),
      checklists: Object.freeze([...(Array.isArray(value.checklists) ? value.checklists : [])]),
      glossary: Object.freeze([...(Array.isArray(value.glossary) ? value.glossary : [])]),
      faqs: Object.freeze([...(Array.isArray(value.faqs) ? value.faqs : [])]),
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

