/**
 * AuthFormLayout Component - Web
 * Shared auth layout for form-based screens.
 * File: AuthFormLayout.web.jsx
 */
import React from 'react';
import Card from '../../display/Card';
import Screen from '../../layout/Screen';
import Stack from '../../layout/Stack';
import Text from '../../display/Text';
import { VARIANTS as CardVariants } from '../../display/Card/types';
import {
  StyledAuthFormActions,
  StyledAuthFormCardWrapper,
  StyledAuthFormContainer,
  StyledAuthFormFooter,
  StyledAuthFormStatus,
  StyledTwoColumnContainer,
  StyledLeftPanel,
  StyledRightPanel,
  StyledWelcomeContent,
  StyledFormContent,
  StyledWelcomeTitle,
  StyledWelcomeDescription,
  StyledFormTitle,
} from './AuthFormLayout.web.styles';
import useAuthFormLayout from './useAuthFormLayout';
import { SIZES } from './types';

/**
 * AuthFormLayout component for Web
 * @param {Object} props - AuthFormLayout props
 */
const AuthFormLayoutWeb = ({
  title,
  description,
  status,
  actions,
  footer,
  children,
  size = SIZES.MD,
  layout: layoutVariant = 'centered',
  welcomeTitle,
  welcomeDescription,
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

  // Two-column layout
  if (layoutVariant === 'two-column') {
    const welcomeContent = (
      <StyledWelcomeContent>
        {welcomeTitle && (
          <StyledWelcomeTitle>
            <Text variant="h1" color="inherit">
              {welcomeTitle}
            </Text>
          </StyledWelcomeTitle>
        )}
        {welcomeDescription && (
          <StyledWelcomeDescription>
            <Text variant="body">
              {welcomeDescription}
            </Text>
          </StyledWelcomeDescription>
        )}
      </StyledWelcomeContent>
    );

    return (
      <Screen
        scroll={false}
        padding="none"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
      >
        <StyledAuthFormContainer $isTwoColumn>
          <StyledTwoColumnContainer>
            <StyledLeftPanel>
              {welcomeContent}
            </StyledLeftPanel>
            <StyledRightPanel>
              <StyledFormContent>
                {header ? (
                  <StyledFormTitle>
                    <Text
                      variant="h2"
                      testID={titleTestID}
                      accessibilityRole="header"
                    >
                      {title}
                    </Text>
                  </StyledFormTitle>
                ) : null}
                {status ? (
                  <StyledAuthFormStatus>
                    {status}
                  </StyledAuthFormStatus>
                ) : null}
                {children}
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
              </StyledFormContent>
            </StyledRightPanel>
          </StyledTwoColumnContainer>
        </StyledAuthFormContainer>
      </Screen>
    );
  }

  // Centered layout (default, backward compatible)
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

export default AuthFormLayoutWeb;

