/**
 * PatientRouteLayout Component - Web
 * Reusable route layout for patient-facing routes on Web
 * File: PatientRouteLayout.web.jsx
 */
import React from 'react';
import { Slot } from 'expo-router';
import { useI18n } from '@hooks';
import PatientFrame from '../../PatientFrame';
import {
  GlobalHeader,
  LanguageControls,
  NoticeSurface,
  Sidebar,
  ThemeControls,
} from '@platform/components';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';
import usePatientRouteLayout from './usePatientRouteLayout';

/**
 * PatientRouteLayout component for Web
 */
const PatientRouteLayoutWeb = () => {
  const { t } = useI18n();
  const { headerActions, overlaySlot, patientItems, isItemVisible } = usePatientRouteLayout();

  return (
    <PatientFrame
      header={(
        <GlobalHeader
          title={t('navigation.patientNavigation')}
          accessibilityLabel={t('navigation.header.title')}
          testID="patient-header"
          actions={headerActions}
          utilitySlot={(
            <>
              <LanguageControls testID="patient-language-controls" />
              <ThemeControls testID="patient-theme-controls" />
            </>
          )}
        />
      )}
      sidebar={(
        <Sidebar
          accessibilityLabel={t('navigation.sidebar.title')}
          items={patientItems}
          isItemVisible={isItemVisible}
          testID="patient-sidebar"
        />
      )}
      footer={(
        <GlobalFooter
          variant={FOOTER_VARIANTS.PATIENT}
          accessibilityLabel={t('navigation.footer.title')}
          testID="patient-footer"
        />
      )}
      overlay={overlaySlot}
      notices={<NoticeSurface testID="patient-notice-surface" />}
      accessibilityLabel={t('navigation.patientNavigation')}
      testID="patient-route-layout"
    >
      <Slot />
    </PatientFrame>
  );
};

export default PatientRouteLayoutWeb;
