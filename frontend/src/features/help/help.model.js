/**
 * Help feature model (P013).
 * Glossary, troubleshooting, and guide entry shapes (keys only; content from i18n).
 */
import { GLOSSARY_KEYS, GUIDE_KEYS, TROUBLESHOOTING_KEYS } from './help.rules';

const getGlossaryKeys = () => [...GLOSSARY_KEYS];
const getTroubleshootingKeys = () => [...TROUBLESHOOTING_KEYS];
const getGuideKeys = () => [...GUIDE_KEYS];

export { getGlossaryKeys, getTroubleshootingKeys, getGuideKeys };
