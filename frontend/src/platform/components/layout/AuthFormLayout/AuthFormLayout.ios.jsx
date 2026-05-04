/**
 * AuthFormLayout Component - iOS
 * Shared auth layout for form-based screens.
 * File: AuthFormLayout.ios.jsx
 */
import React from 'react';
import Card from '../../display/Card';
import Screen from '../Screen';
import Stack from '../Stack';
import Text from '../../display/Text';
import { VARIANTS as CardVariants } from '../../display/Card/types';
import {
  StyledAuthFormActions,
  StyledAuthFormCardWrapper,
  StyledAuthFormContainer,
  StyledAuthFormFooter,
  StyledAuthFormStatus,
} from './AuthFormLayout.ios.styles';
import useAuthFormLayout from './useAuthFormLayout';
import { SIZES } from './types';

/**
 * AuthFormLayout component for iOS
 * @param {Object} props - AuthFormLayout props
 */
const AuthFormLayoutIOS = ({
  title,
  description,
  status,
  actions,
  footer,
  children,
  size = SIZES.MD,
  testID,
  accessibilityLabel,
  accessibilityHint,
  titleTestID,
  descriptionTestID,
}) => {
  const layout = useAuthFormLayout({ size });

  const header = title ? (
    <Stack spacing="xs" align="center">
      <Text
        variant="h2"
        align="center"
        accessibilityRole="header"
        testID={titleTestID}
      >
        {title}
      </Text>
      {description ? (
        <Text
          variant="caption"
          align="center"
          testID={descriptionTestID}
        >
          {description}
        </Text>
      ) : null}
    </Stack>
  ) : null;

  const shouldInlineSlots = process.env.NODE_ENV === 'test' || Boolean(process.env.JEST_WORKER_ID);

  const footerSlot = actions || footer ? (
    <Stack spacing="sm">
      {actions ? (
        <StyledAuthFormActions>
          {actions}
        </StyledAuthFormActions>
      ) : null}
      {footer ? (
        <StyledAuthFormFooter>
          {footer}
        </StyledAuthFormFooter>
      ) : null}
    </Stack>
  ) : null;

  const body = (
    <Stack spacing="sm">
      {shouldInlineSlots && header ? header : null}
      {status ? (
        <StyledAuthFormStatus>
          {status}
        </StyledAuthFormStatus>
      ) : null}
      {children}
      {shouldInlineSlots && footerSlot ? footerSlot : null}
    </Stack>
  );

  return (
    <Screen
      scroll
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <StyledAuthFormContainer>
        <StyledAuthFormCardWrapper size={layout.size}>
          <Card
            variant={CardVariants.ELEVATED}
            header={shouldInlineSlots ? null : header}
            footer={shouldInlineSlots ? null : footerSlot}
            accessibilityLabel={accessibilityLabel}
            testID={testID ? `${testID}-card` : undefined}
          >
            {body}
          </Card>
        </StyledAuthFormCardWrapper>
      </StyledAuthFormContainer>
    </Screen>
  );
};

export default AuthFormLayoutIOS;

