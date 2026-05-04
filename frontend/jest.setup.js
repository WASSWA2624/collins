/**
 * Jest Setup File
 * File: jest.setup.js
 *
 * Runs before tests to provide minimal, deterministic environment setup.
 */

try {
  const NativeModules = require('react-native/Libraries/BatchedBridge/NativeModules');

  const needsInitialization =
    !NativeModules.default || typeof NativeModules.default !== 'object';

  if (needsInitialization) {
    Object.defineProperty(NativeModules, 'default', {
      value: {},
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
} catch (error) {
  // Ignore: jest-expo / RN mocks may vary across environments.
}

// Mock React Native's Animated API
jest.mock(
  'react-native/Libraries/Animated/NativeAnimatedHelper',
  () => ({}),
  { virtual: true }
);

// Setup global test environment
global.__DEV__ = true;


// Mock styled-components to handle both web and native
const createStyledMock = () => {
  const startTime = Date.now();
  const React = require('react');
  const RN = require('react-native');
  const { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Image } = RN;
  // Import SafeAreaView from react-native-safe-area-context to avoid deprecation warning
  const SafeAreaView = require('react-native-safe-area-context').SafeAreaView || View;
  
  const omitTransientProps = (props) => {
    if (!props) return props;
    return Object.keys(props).reduce((acc, key) => {
      if (!key.startsWith('$')) {
        acc[key] = props[key];
      }
      return acc;
    }, {});
  };

  const createStyledComponent = (component, displayName) => {
    const resolvedComponent = component || View;
    const styledFn = (strings, ...interpolations) => {
      const StyledComponent = React.forwardRef((props, ref) => {
        const filteredProps = omitTransientProps(props);
        return React.createElement(resolvedComponent, { ref, ...filteredProps });
      });
      StyledComponent.displayName =
        displayName || `Styled${resolvedComponent.displayName || resolvedComponent.name || 'Component'}`;
      return StyledComponent;
    };
    
    // Add .attrs() method support
    styledFn.attrs = (attrsFn) => {
      return (strings, ...interpolations) => {
        const StyledComponent = React.forwardRef((props, ref) => {
          const attrs = typeof attrsFn === 'function' ? attrsFn(props) : attrsFn;
          const mergedProps = { ...attrs, ...props };
          const filteredProps = omitTransientProps(mergedProps);
          return React.createElement(resolvedComponent, { ref, ...filteredProps });
        });
        StyledComponent.displayName =
          displayName || `Styled${resolvedComponent.displayName || resolvedComponent.name || 'Component'}`;
        return StyledComponent;
      };
    };
    
    // Add .withConfig() method support
    styledFn.withConfig = (config) => {
      const { displayName: configDisplayName, componentId } = config || {};
      const finalDisplayName =
        configDisplayName || displayName || `Styled${resolvedComponent.displayName || resolvedComponent.name || 'Component'}`;
      const styledWithConfig = (strings, ...interpolations) => {
        const StyledComponent = React.forwardRef((props, ref) => {
          const filteredProps = omitTransientProps(props);
          return React.createElement(resolvedComponent, { ref, ...filteredProps });
        });
        StyledComponent.displayName = finalDisplayName;
        if (componentId) {
          StyledComponent.componentId = componentId;
        }
        return StyledComponent;
      };
      
      // Add .attrs() support to withConfig result
      styledWithConfig.attrs = (attrsFn) => {
        return (strings, ...interpolations) => {
          const StyledComponent = React.forwardRef((props, ref) => {
            const attrs = typeof attrsFn === 'function' ? attrsFn(props) : attrsFn;
            const mergedProps = { ...attrs, ...props };
            const filteredProps = omitTransientProps(mergedProps);
            return React.createElement(resolvedComponent, { ref, ...filteredProps });
          });
          StyledComponent.displayName = finalDisplayName;
          if (componentId) {
            StyledComponent.componentId = componentId;
          }
          return StyledComponent;
        };
      };
      
      // Add .withConfig() support to withConfig result (chainable)
      styledWithConfig.withConfig = styledFn.withConfig;
      
      return styledWithConfig;
    };
    
    return styledFn;
  };

  const styled = (component) => {
    if (typeof component === 'string') {
      const componentMap = {
        form: View,
        div: View,
        span: Text,
        button: TouchableOpacity,
        input: View,
        textarea: View,
        select: View,
        label: View,
        a: TouchableOpacity,
        p: Text,
        h1: Text,
        h2: Text,
        h3: Text,
        h4: Text,
        h5: Text,
        h6: Text,
        hr: View,
        ul: ScrollView,
        li: View,
        nav: View,
        header: View,
        footer: View,
        section: View,
        article: View,
        main: View,
        aside: View,
        img: Image || View,
      };
      const Component = componentMap[component] || View;
      return createStyledComponent(Component, `styled.${component}`);
    }
    // If component is a React component, wrap it
    const resolvedName =
      component && (component.displayName || component.name) ? (component.displayName || component.name) : 'Component';
    return createStyledComponent(component, `Styled${resolvedName}`);
  };

  // Add properties for styled.form, styled.div, etc.
  const componentMap = {
    form: View,
    div: View,
    span: Text,
    button: TouchableOpacity,
    input: View,
    textarea: View,
    select: View,
    label: View,
    a: TouchableOpacity,
    p: Text,
    h1: Text,
    h2: Text,
    h3: Text,
    h4: Text,
    h5: Text,
    h6: Text,
    hr: View,
    ul: ScrollView,
    li: View,
    nav: View,
    header: View,
    footer: View,
    section: View,
    article: View,
    main: View,
    aside: View,
    img: Image || View,
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    SafeAreaView,
    TouchableOpacity,
    TouchableHighlight: TouchableOpacity,
    TouchableWithoutFeedback: TouchableOpacity,
    Pressable: TouchableOpacity,
    Image: View,
    FlatList: ScrollView,
    SectionList: ScrollView,
    ActivityIndicator: View,
    Switch: View,
    TextInput: View,
    Modal: View,
  };

  Object.keys(componentMap).forEach(key => {
    styled[key] = createStyledComponent(componentMap[key], `styled.${key}`);
  });

  const duration = Date.now() - startTime;

  return styled;
};

jest.mock('styled-components', () => {
  const React = require('react');
  const styled = createStyledMock();
  return {
    __esModule: true,
    default: styled,
    ThemeProvider: ({ children, theme }) => children,
    withTheme: (component) => component,
    css: () => ({}),
    keyframes: () => ({}),
    createGlobalStyle: () => () => null,
  };
});

jest.mock('styled-components/native', () => {
  const mockStartTime = Date.now();
  const React = require('react');
  const RN = require('react-native');
  const { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Pressable, Image, FlatList, SectionList } = RN;
  const styled = createStyledMock();
  
  // Add React Native specific components to styled
  styled.View = styled(View);
  styled.Text = styled(Text);
  styled.ScrollView = styled(ScrollView);
  styled.KeyboardAvoidingView = styled(KeyboardAvoidingView);
  styled.TouchableOpacity = styled(TouchableOpacity);
  styled.TouchableHighlight = styled(TouchableHighlight || TouchableOpacity);
  styled.TouchableWithoutFeedback = styled(TouchableWithoutFeedback || TouchableOpacity);
  styled.Pressable = styled(Pressable || TouchableOpacity);
  styled.Image = styled(Image || View);
  styled.FlatList = styled(FlatList || ScrollView);
  styled.SectionList = styled(SectionList || ScrollView);
  
  // Create a simple theme context for useTheme hook
  let defaultTheme = {};
  try {
    const lightThemeModule = require('@theme/light.theme');
    defaultTheme = lightThemeModule.default || lightThemeModule;
  } catch {
    // Fallback empty theme if not available
  }
  
  const ThemeContext = React.createContext(defaultTheme);

  const ThemeProviderMock = ({ children, theme = defaultTheme }) => {
    return React.createElement(ThemeContext.Provider, { value: theme }, children);
  };
  
  const useThemeMock = () => {
    const context = React.useContext(ThemeContext);
    return context || defaultTheme;
  };
  
  const mockDuration = Date.now() - mockStartTime;
  
  return {
    __esModule: true,
    default: styled,
    ThemeProvider: ThemeProviderMock,
    useTheme: useThemeMock,
    withTheme: (component) => component,
    css: () => ({}),
    keyframes: () => ({}),
  };
});

// expo-local-authentication (required: deterministic mock for tests)
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(async () => false),
  isEnrolledAsync: jest.fn(async () => false),
  authenticateAsync: jest.fn(async () => ({ success: false })),
  supportedAuthenticationTypesAsync: jest.fn(async () => []),
  AuthenticationType: {},
}));

// AsyncStorage (required: prevent "NativeModule: AsyncStorage is null" during Jest)
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
  { virtual: true }
);

// SecureStore (required: deterministic mock for tests)
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => true),
  deleteItemAsync: jest.fn(async () => true),
}));

// react-native-safe-area-context (required: mock SafeAreaView to avoid deprecation warnings)
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const SafeAreaView = React.forwardRef((props, ref) => {
    return React.createElement(View, { ref, ...props });
  });
  SafeAreaView.displayName = 'SafeAreaView';
  return {
    SafeAreaView,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
  };
});

// @react-native-community/netinfo (required: mock for tests that import bootstrap)
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
  addEventListener: jest.fn(() => jest.fn()),
  configure: jest.fn(),
}), { virtual: true });

// Expo Router (required: mock for all tests using expo-router)
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  usePathname: () => '/',
  useSegments: () => [],
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  Stack: ({ children }) => children,
  Tabs: ({ children }) => children,
  Slot: ({ children }) => children,
  Link: ({ children, href, ...props }) => {
    const React = require('react');
    return React.createElement('a', { href, ...props }, children);
  },
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
}));

// Mock platform components to prevent module resolution issues with parentheses in path
// This comprehensive mock handles both ES6 imports and CommonJS requires
const React = require('react');
const { View, Text: RNText, TouchableOpacity } = require('react-native');

const createMockComponent = (name, renderFn) => {
  const Component = (props) => renderFn(props);
  Component.displayName = name;
  return Component;
};

const mockComponents = {
  Avatar: createMockComponent('Avatar', ({ size, source, name, testID, ...props }) => {
    return React.createElement(
      View,
      { testID, ...props },
      source ? React.createElement(RNText, {}, 'Avatar') : React.createElement(RNText, {}, name || 'U')
    );
  }),
  Badge: createMockComponent('Badge', ({ variant, size, children, testID, ...props }) => {
    return React.createElement(
      View,
      { testID, ...props },
      React.createElement(RNText, {}, children)
    );
  }),
  Text: createMockComponent('Text', ({ children, variant, align, color, testID, ...props }) => {
    return React.createElement(RNText, { testID, ...props }, children);
  }),
  Divider: createMockComponent('Divider', ({ testID, ...props }) => {
    return React.createElement(View, { testID, ...props });
  }),
  Button: createMockComponent('Button', ({ text, children, onPress, onClick, disabled, loading, testID, ...props }) => {
    const handlePress = onPress || onClick;
    return React.createElement(
      TouchableOpacity,
      { testID, disabled, onPress: handlePress, ...props },
      React.createElement(RNText, {}, text || children)
    );
  }),
  TextField: createMockComponent('TextField', ({ label, value, onChange, onChangeText, testID, ...props }) => {
    const handleChange = onChange || onChangeText;
    return React.createElement(
      View,
      { testID, ...props },
      label && React.createElement(RNText, {}, label),
      React.createElement(RNText, {}, value || '')
    );
  }),
  Card: createMockComponent('Card', ({ children, testID, ...props }) => {
    return React.createElement(View, { testID, ...props }, children);
  }),
  Modal: createMockComponent('Modal', ({ children, visible, testID, ...props }) => {
    if (!visible) return null;
    return React.createElement(View, { testID, ...props }, children);
  }),
};

// Mock individual component exports (for ES6 imports)
jest.mock('@platform/components/Avatar', () => ({
  __esModule: true,
  default: mockComponents.Avatar,
  SIZES: { SMALL: 'small', MEDIUM: 'medium', LARGE: 'large', XLARGE: 'xlarge' },
}), { virtual: true });

jest.mock('@platform/components/Badge', () => ({
  __esModule: true,
  default: mockComponents.Badge,
  SIZES: { SMALL: 'small', MEDIUM: 'medium', LARGE: 'large' },
  VARIANTS: { PRIMARY: 'primary', SUCCESS: 'success', WARNING: 'warning', ERROR: 'error' },
}), { virtual: true });

jest.mock('@platform/components/Text', () => ({
  __esModule: true,
  default: mockComponents.Text,
  VARIANTS: {},
}), { virtual: true });

jest.mock('@platform/components/Divider', () => ({
  __esModule: true,
  default: mockComponents.Divider,
}), { virtual: true });

jest.mock('@platform/components/Button', () => ({
  __esModule: true,
  default: mockComponents.Button,
}), { virtual: true });

jest.mock('@platform/components/TextField', () => ({
  __esModule: true,
  default: mockComponents.TextField,
}), { virtual: true });

jest.mock('@platform/components/Card', () => ({
  __esModule: true,
  default: mockComponents.Card,
}), { virtual: true });

jest.mock('@platform/components/Modal', () => ({
  __esModule: true,
  default: mockComponents.Modal,
}), { virtual: true });

// Mock components that might be imported via relative paths
jest.mock('@platform/components/Image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => React.createElement(View, { ref, ...props, testID: 'image' })),
  };
}, { virtual: true });

jest.mock('@platform/components/LoadingSpinner', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ testID, ...props }) => React.createElement(View, { testID, ...props }),
  };
}, { virtual: true });

// Mock the entire @platform/components module (for CommonJS requires)
// This handles both known components and provides a fallback for any missing ones
jest.mock('@platform/components', () => {
  const React = require('react');
  const { View, Text: RNText } = require('react-native');
  
  const createGenericMockComponent = (name) => {
    const Component = ({ children, testID, ...props }) => {
      return React.createElement(View, { testID, ...props }, children);
    };
    Component.displayName = name;
    return Component;
  };
  
  const baseComponents = {
    Avatar: mockComponents.Avatar,
    Badge: mockComponents.Badge,
    Text: mockComponents.Text,
    Divider: mockComponents.Divider,
    Button: mockComponents.Button,
    TextField: mockComponents.TextField,
    Card: mockComponents.Card,
    Modal: mockComponents.Modal,
    LoadingSpinner: createGenericMockComponent('LoadingSpinner'),
    Skeleton: createGenericMockComponent('Skeleton'),
    EmptyState: createGenericMockComponent('EmptyState'),
    ErrorState: createGenericMockComponent('ErrorState'),
    OfflineState: createGenericMockComponent('OfflineState'),
    Image: createGenericMockComponent('Image'),
    Icon: createGenericMockComponent('Icon'),
    Chip: createGenericMockComponent('Chip'),
    List: createGenericMockComponent('List'),
    ListItem: createGenericMockComponent('ListItem'),
    Accordion: createGenericMockComponent('Accordion'),
    TextArea: createGenericMockComponent('TextArea'),
    PasswordField: createGenericMockComponent('PasswordField'),
    Checkbox: createGenericMockComponent('Checkbox'),
    Radio: createGenericMockComponent('Radio'),
    Switch: createGenericMockComponent('Switch'),
    Select: createGenericMockComponent('Select'),
    Dropdown: createGenericMockComponent('Dropdown'),
    Slider: createGenericMockComponent('Slider'),
    Toast: createGenericMockComponent('Toast'),
    Snackbar: createGenericMockComponent('Snackbar'),
    Tooltip: createGenericMockComponent('Tooltip'),
    ProgressBar: createGenericMockComponent('ProgressBar'),
    Container: createGenericMockComponent('Container'),
    Stack: createGenericMockComponent('Stack'),
    Spacer: createGenericMockComponent('Spacer'),
    Screen: createGenericMockComponent('Screen'),
    Header: createGenericMockComponent('Header'),
    Sidebar: createGenericMockComponent('Sidebar'),
    TabBar: createGenericMockComponent('TabBar'),
    Tabs: createGenericMockComponent('Tabs'),
    Tab: createGenericMockComponent('Tab'),
    Breadcrumbs: createGenericMockComponent('Breadcrumbs'),
    Navigation: createGenericMockComponent('Navigation'),
  };
  
  return new Proxy({
    __esModule: true,
    ...baseComponents,
  }, {
    get: (target, prop) => {
      if (prop in target) {
        return target[prop];
      }
      // Return a generic mock component for any missing component
      return createGenericMockComponent(prop);
    },
  });
}, { virtual: true });



