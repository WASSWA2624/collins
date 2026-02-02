/**
 * Help use case (P013).
 * Search over glossary, troubleshooting, guides; returns key sets for UI.
 */
import {
  filterGlossaryKeys,
  filterTroubleshootingKeys,
  filterGuideKeys,
} from './help.rules';

const searchHelp = (query) => {
  const glossary = filterGlossaryKeys(query);
  const troubleshooting = filterTroubleshootingKeys(query);
  const guides = filterGuideKeys(query);
  return { glossary, troubleshooting, guides };
};

export { searchHelp };
