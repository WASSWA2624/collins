/**
 * AuthBrand
 * Reusable branded header for authentication entry surfaces.
 * File: AuthBrand.jsx
 */
import React from 'react';
import AppLogo from '../AppLogo';
import Text from '../Text';
import Stack from '../../layout/Stack';

const AuthBrand = ({
  name,
  subtitle,
  logoLabel,
  layout = 'vertical',
  testID = 'auth-brand',
  accessibilityLabel,
}) => {
  const isHorizontal = layout === 'horizontal';

  return (
    <Stack
      spacing="xs"
      align="center"
      accessibilityLabel={accessibilityLabel || name}
      testID={testID}
    >
      <Stack
        direction={isHorizontal ? 'horizontal' : 'vertical'}
        spacing={isHorizontal ? 'sm' : 'xs'}
        align="center"
        justify="center"
        testID={`${testID}-mark`}
      >
        <AppLogo
          size="lg"
          accessibilityLabel={logoLabel || name}
          testID={`${testID}-logo`}
        />
        <Text variant="h1" align="center" testID={`${testID}-name`}>
          {name}
        </Text>
      </Stack>
      {subtitle ? (
        <Text variant="caption" align="center" color="text.secondary" testID={`${testID}-subtitle`}>
          {subtitle}
        </Text>
      ) : null}
    </Stack>
  );
};

export default AuthBrand;
