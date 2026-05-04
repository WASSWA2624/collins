/**
 * useHelpScreen (P013).
 * Composes useHelp; exposes testIds and i18n labels.
 */
import useHelp from '@hooks/useHelp';
import { useMemo } from 'react';
import { useI18n } from '@hooks';
import { HELP_TEST_IDS } from './types';

export default function useHelpScreen() {
  const help = useHelp();
  const { t } = useI18n();

  const glossaryLabel = (key) => t(`settings.help.glossary.${key}`);
  const troubleshootingTitle = (key) => t(`settings.help.troubleshooting.${key}.title`);
  const troubleshootingBody = (key) => t(`settings.help.troubleshooting.${key}.body`);
  const guideLabel = (key) => t(`settings.help.guides.${key}`);

  return useMemo(
    () => ({
      ...help,
      testIds: HELP_TEST_IDS,
      glossaryLabel,
      troubleshootingTitle,
      troubleshootingBody,
      guideLabel,
    }),
    [help, glossaryLabel, troubleshootingTitle, troubleshootingBody, guideLabel]
  );
}
