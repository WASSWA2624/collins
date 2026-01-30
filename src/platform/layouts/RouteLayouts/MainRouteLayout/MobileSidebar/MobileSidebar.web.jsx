/**
 * MobileSidebar - Web
 * Mobile sidebar overlay, panel, close button, and Sidebar content
 * File: MobileSidebar/MobileSidebar.web.jsx
 */

import React from 'react';
import { Sidebar } from '@platform/components';
import {
  StyledMobileSidebarBackdrop,
  StyledMobileSidebarContent,
  StyledMobileSidebarHeader,
  StyledMobileSidebarOverlay,
  StyledMobileSidebarPanel,
  StyledMobileCloseButton,
} from './MobileSidebar.web.styles';

export default function MobileSidebar({
  isOpen,
  onClose,
  onKeyDown,
  sidebarLabel,
  closeLabel,
  mainItems,
  isItemVisible,
  closeButtonRef,
  panelRef,
}) {
  return (
    <StyledMobileSidebarOverlay
      isOpen={isOpen}
      aria-hidden={!isOpen}
      onKeyDown={onKeyDown}
    >
      <StyledMobileSidebarPanel
        isOpen={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label={sidebarLabel}
        ref={panelRef}
      >
        <StyledMobileSidebarHeader>
          <StyledMobileCloseButton
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            ref={closeButtonRef}
          >
            X
          </StyledMobileCloseButton>
        </StyledMobileSidebarHeader>
        <StyledMobileSidebarContent>
          <Sidebar
            accessibilityLabel={sidebarLabel}
            items={mainItems}
            isItemVisible={isItemVisible}
            collapsed
            footerSlot={null}
            testID="main-sidebar-mobile"
          />
        </StyledMobileSidebarContent>
      </StyledMobileSidebarPanel>
      <StyledMobileSidebarBackdrop
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
      />
    </StyledMobileSidebarOverlay>
  );
}
