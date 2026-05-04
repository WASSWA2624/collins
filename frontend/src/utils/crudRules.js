/**
 * CRUD Rules Factory
 * Shared validation for CRUD features
 * File: crudRules.js
 */
import { z } from 'zod';

const idSchema = z.union([z.string().min(1), z.number().int().nonnegative()]);
const payloadSchema = z.object({}).passthrough();
const listParamsSchema = z
  .object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
    sort_by: z.string().min(1).optional(),
    order: z.enum(['asc', 'desc']).optional(),
  })
  .passthrough();

const createCrudRules = () => ({
  parseId: (value) => idSchema.parse(value),
  parsePayload: (value) => payloadSchema.parse(value ?? {}),
  parseListParams: (value) => listParamsSchema.parse(value ?? {}),
});

export { createCrudRules };
