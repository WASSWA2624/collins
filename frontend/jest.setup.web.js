/**
 * Jest Setup File for Web Tests
 * File: jest.setup.web.js
 *
 * Minimal setup for web component tests (jsdom environment)
 */

// Mock fetch for styled-components mocks
global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

// Setup global test environment
global.__DEV__ = true;

// Mock styled-components for web
jest.mock('styled-components', () => {
  const React = require('react');
  
  // Create a theme context that will be used by ThemeProvider and useTheme
  const ThemeContext = React.createContext(null);
  
  const createStyledMock = (component, displayName) => {
    const styledFn = (strings, ...interpolations) => {
      const StyledComponent = React.forwardRef((props, ref) => {
        return React.createElement(component, { ref, ...props });
      });
      StyledComponent.displayName = displayName || `Styled${component.displayName || component.name || 'Component'}`;
      return StyledComponent;
    };
    
    styledFn.attrs = (attrsFn) => {
      return (strings, ...interpolations) => {
        const StyledComponent = React.forwardRef((props, ref) => {
          const attrs = typeof attrsFn === 'function' ? attrsFn(props) : attrsFn;
          return React.createElement(component, { ref, ...attrs, ...props });
        });
        StyledComponent.displayName = displayName || `Styled${component.displayName || component.name || 'Component'}`;
        return StyledComponent;
      };
    };
    
    // Add .withConfig() method support
    styledFn.withConfig = (config) => {
      const { displayName: configDisplayName, componentId } = config || {};
      const finalDisplayName = configDisplayName || displayName || `Styled${component.displayName || component.name || 'Component'}`;
      const styledWithConfig = (strings, ...interpolations) => {
        const StyledComponent = React.forwardRef((props, ref) => {
          return React.createElement(component, { ref, ...props });
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
            return React.createElement(component, { ref, ...attrs, ...props });
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

  const styled = new Proxy({}, {
    get: (target, prop) => {
      if (prop === 'default') {
        return styled;
      }
      // Map HTML elements to div for web
      const htmlElements = ['div', 'button', 'span', 'label', 'ul', 'li', 'input', 'select', 'option', 'img'];
      if (htmlElements.includes(prop.toLowerCase())) {
        return createStyledMock('div', `Styled${prop}`);
      }
      return createStyledMock('div', `Styled${prop}`);
    },
  });

  // useTheme hook - reads from ThemeContext
  const useTheme = () => {
    const theme = React.useContext(ThemeContext);
    if (!theme) {
      // Fallback theme if no ThemeProvider
      return {
        colors: {
          background: { secondary: '#f5f5f5' },
          text: { tertiary: '#999999' },
        },
        spacing: {},
        typography: {},
        radius: {},
        shadows: {},
      };
    }
    return theme;
  };

  // ThemeProvider - provides theme via context
  const ThemeProvider = ({ children, theme }) => {
    return React.createElement(ThemeContext.Provider, { value: theme }, children);
  };

  return {
    __esModule: true,
    default: styled,
    ThemeProvider,
    useTheme,
  };
});

