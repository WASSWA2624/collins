/**
 * Training Use Cases
 * File: training.usecase.js
 */
import { handleError } from '@errors';
import { getDefaultTrainingContent, parseTrainingContent } from './training.model';
import { searchTrainingContent } from './training.rules';
 
const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};
 
const loadTrainingContentUseCase = async (rawContent) =>
  execute(async () => {
    if (rawContent !== undefined) {
      return parseTrainingContent(rawContent);
    }
    return getDefaultTrainingContent();
  });
 
const searchTrainingContentUseCase = async ({ query, types, tags, limit, rawContent } = {}) =>
  execute(async () => {
    const content = rawContent !== undefined ? parseTrainingContent(rawContent) : getDefaultTrainingContent();
    return searchTrainingContent({ content, query, types, tags, limit });
  });
 
export { loadTrainingContentUseCase, searchTrainingContentUseCase };

