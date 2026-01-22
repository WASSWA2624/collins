/**
 * AuthFormLayout Component Tests
 * File: AuthFormLayout.test.js
 *
 * Tests all three platform implementations (Android, iOS, Web)
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Text } = require('@platform/components');

const AuthFormLayoutAndroid = require('@platform/components/layout/AuthFormLayout/AuthFormLayout.android').default;
const AuthFormLayoutIOS = require('@platform/components/layout/AuthFormLayout/AuthFormLayout.ios').default;
const AuthFormLayoutWeb = require('@platform/components/layout/AuthFormLayout/AuthFormLayout.web').default;
const useAuthFormLayout = require('@platform/components/layout/AuthFormLayout/useAuthFormLayout').default;
// eslint-disable-next-line import/no-unresolved
const AuthFormLayoutIndex = require('@platform/components/layout/AuthFormLayout/index.js');
// eslint-disable-next-line import/no-unresolved
const { SIZES } = require('@platform/components/layout/AuthFormLayout/types.js');

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

describe('AuthFormLayout Component', () => {
  const statusNode = <Text testID="auth-status">Status</Text>;
  const actionNode = <Text testID="auth-action">Action</Text>;
  const footerNode = <Text testID="auth-footer">Footer</Text>;

  describe('Android Implementation', () => {
    it('renders full layout', () => {
      const { getByTestId } = renderWithTheme(
        <AuthFormLayoutAndroid
          title="Title"
          description="Description"
          status={statusNode}
          actions={actionNode}
          footer={footerNode}
          testID="auth-layout"
          titleTestID="auth-title"
          descriptionTestID="auth-description"
          size={SIZES.MD}
        />
      );
      expect(getByTestId('auth-layout')).toBeTruthy();
      expect(getByTestId('auth-title')).toBeTruthy();
      expect(getByTestId('auth-description')).toBeTruthy();
      expect(getByTestId('auth-status')).toBeTruthy();
      expect(getByTestId('auth-action')).toBeTruthy();
      expect(getByTestId('auth-footer')).toBeTruthy();
    });

    it('renders minimal layout', () => {
      const { getByTestId, queryByTestId } = renderWithTheme(
        <AuthFormLayoutAndroid
          title="Title"
          testID="auth-layout-min"
          titleTestID="auth-title-min"
        />
      );
      expect(getByTestId('auth-layout-min')).toBeTruthy();
      expect(getByTestId('auth-title-min')).toBeTruthy();
      expect(queryByTestId('auth-description')).toBeNull();
    });
  });

  describe('iOS Implementation', () => {
    it('renders full layout', () => {
      const { getByTestId } = renderWithTheme(
        <AuthFormLayoutIOS
          title="Title"
          description="Description"
          status={statusNode}
          actions={actionNode}
          footer={footerNode}
          testID="auth-layout"
          titleTestID="auth-title"
          descriptionTestID="auth-description"
          size={SIZES.MD}
        />
      );
      expect(getByTestId('auth-layout')).toBeTruthy();
      expect(getByTestId('auth-title')).toBeTruthy();
      expect(getByTestId('auth-description')).toBeTruthy();
      expect(getByTestId('auth-status')).toBeTruthy();
      expect(getByTestId('auth-action')).toBeTruthy();
      expect(getByTestId('auth-footer')).toBeTruthy();
    });

    it('renders minimal layout', () => {
      const { getByTestId, queryByTestId } = renderWithTheme(
        <AuthFormLayoutIOS
          title="Title"
          testID="auth-layout-min"
          titleTestID="auth-title-min"
        />
      );
      expect(getByTestId('auth-layout-min')).toBeTruthy();
      expect(getByTestId('auth-title-min')).toBeTruthy();
      expect(queryByTestId('auth-description')).toBeNull();
    });
  });

  describe('Web Implementation', () => {
    it('renders full layout', () => {
      const { getByTestId } = renderWithTheme(
        <AuthFormLayoutWeb
          title="Title"
          description="Description"
          status={statusNode}
          actions={actionNode}
          footer={footerNode}
          testID="auth-layout"
          titleTestID="auth-title"
          descriptionTestID="auth-description"
          size={SIZES.MD}
        />
      );
      expect(getByTestId('auth-layout')).toBeTruthy();
      expect(getByTestId('auth-title')).toBeTruthy();
      expect(getByTestId('auth-description')).toBeTruthy();
      expect(getByTestId('auth-status')).toBeTruthy();
      expect(getByTestId('auth-action')).toBeTruthy();
      expect(getByTestId('auth-footer')).toBeTruthy();
    });

    it('renders minimal layout', () => {
      const { getByTestId, queryByTestId } = renderWithTheme(
        <AuthFormLayoutWeb
          title="Title"
          testID="auth-layout-min"
          titleTestID="auth-title-min"
        />
      );
      expect(getByTestId('auth-layout-min')).toBeTruthy();
      expect(getByTestId('auth-title-min')).toBeTruthy();
      expect(queryByTestId('auth-description')).toBeNull();
    });
  });

  it('exposes hook and types for coverage', () => {
    const HookProbe = ({ size }) => {
      const value = useAuthFormLayout({ size });
      return <Text testID="auth-hook-size">{value.size}</Text>;
    };
    const { getByTestId } = renderWithTheme(<HookProbe size={SIZES.SM} />);
    expect(getByTestId('auth-hook-size').props.children).toBe(SIZES.SM);
    expect(AuthFormLayoutIndex).toBeDefined();
  });
});

