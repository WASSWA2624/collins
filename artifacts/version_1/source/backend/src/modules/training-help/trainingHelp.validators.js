import { z } from 'zod';
import { TRAINING_HELP_WORKFLOWS } from './trainingHelp.content.js';

export const trainingHelpSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    workflow: z.enum(TRAINING_HELP_WORKFLOWS).optional(),
  }).optional(),
});
