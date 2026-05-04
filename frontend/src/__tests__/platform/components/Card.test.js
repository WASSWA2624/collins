/**
 * Card Component Tests
 * File: Card.test.js
 */

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import Card, { VARIANTS } from '@platform/components/display/Card';
import CardAndroid from '@platform/components/display/Card/Card.android';
import CardIOS from '@platform/components/display/Card/Card.ios';
import CardWeb from '@platform/components/display/Card/Card.web';
import lightTheme from '@theme/light.theme';

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

const renderWithWebTheme = (component) => {
  return render(<WebThemeProvider theme={lightTheme}>{component}</WebThemeProvider>);
};

describe('Card Component', () => {
  describe('Platform-agnostic tests (via index)', () => {
    it('should render', () => {
      const { getByText } = renderWithTheme(
        <Card testID="card">
          <Text>Card Content</Text>
        </Card>
      );
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('should render elevated variant', () => {
      const { getByText } = renderWithTheme(
        <Card variant={VARIANTS.ELEVATED}>
          <Text>Card Content</Text>
        </Card>
      );
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('should render outlined variant', () => {
      const { getByText } = renderWithTheme(
        <Card variant={VARIANTS.OUTLINED}>
          <Text>Card Content</Text>
        </Card>
      );
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('should default to elevated variant', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <Text>Card Content</Text>
        </Card>
      );
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('should have article accessibility role', () => {
      const { getByLabelText } = renderWithTheme(
        <Card testID="card" accessibilityLabel="Card">
          <Text>Content</Text>
        </Card>
      );
      const card = getByLabelText('Card');
      expect(card.props.accessibilityRole).toBe('article');
    });

    it('should have custom accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <Card accessibilityLabel="Product Card">
          <Text>Content</Text>
        </Card>
      );
      expect(getByLabelText('Product Card')).toBeTruthy();
    });
  });

  describe('Android platform', () => {
    it('should render Android component', () => {
      const { getByText } = renderWithTheme(
        <CardAndroid testID="card-android">
          <Text>Android Content</Text>
        </CardAndroid>
      );
      expect(getByText('Android Content')).toBeTruthy();
    });

    it('should render elevated variant on Android', () => {
      const { getByText } = renderWithTheme(
        <CardAndroid variant={VARIANTS.ELEVATED}>
          <Text>Elevated Card</Text>
        </CardAndroid>
      );
      expect(getByText('Elevated Card')).toBeTruthy();
    });

    it('should render outlined variant on Android', () => {
      const { getByText } = renderWithTheme(
        <CardAndroid variant={VARIANTS.OUTLINED}>
          <Text>Outlined Card</Text>
        </CardAndroid>
      );
      expect(getByText('Outlined Card')).toBeTruthy();
    });

    it('should default to elevated variant on Android', () => {
      const { getByText } = renderWithTheme(
        <CardAndroid>
          <Text>Default Card</Text>
        </CardAndroid>
      );
      expect(getByText('Default Card')).toBeTruthy();
    });

    it('should have article accessibility role on Android', () => {
      const { getByTestId } = renderWithTheme(
        <CardAndroid testID="card-android">
          <Text>Content</Text>
        </CardAndroid>
      );
      const card = getByTestId('card-android');
      expect(card.props.accessibilityRole).toBe('article');
    });

    it('should have custom accessibility label on Android', () => {
      const { getByLabelText } = renderWithTheme(
        <CardAndroid accessibilityLabel="Android Card">
          <Text>Content</Text>
        </CardAndroid>
      );
      expect(getByLabelText('Android Card')).toBeTruthy();
    });

    it('should have accessibility hint on Android', () => {
      const { getByTestId } = renderWithTheme(
        <CardAndroid testID="card-android" accessibilityHint="This is an Android card">
          <Text>Content</Text>
        </CardAndroid>
      );
      const card = getByTestId('card-android');
      expect(card.props.accessibilityHint).toBe('This is an Android card');
    });

    it('should render header on Android', () => {
      const { getByText } = renderWithTheme(
        <CardAndroid header={<Text>Android Header</Text>}>
          <Text>Body</Text>
        </CardAndroid>
      );
      expect(getByText('Android Header')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
    });

    it('should render footer on Android', () => {
      const { getByText } = renderWithTheme(
        <CardAndroid footer={<Text>Android Footer</Text>}>
          <Text>Body</Text>
        </CardAndroid>
      );
      expect(getByText('Android Footer')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
    });

    it('should render all sections on Android', () => {
      const { getByText } = renderWithTheme(
        <CardAndroid
          header={<Text>Header</Text>}
          footer={<Text>Footer</Text>}
        >
          <Text>Body</Text>
        </CardAndroid>
      );
      expect(getByText('Header')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });

    it('should accept style prop on Android', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = renderWithTheme(
        <CardAndroid testID="card-android" style={customStyle}>
          <Text>Content</Text>
        </CardAndroid>
      );
      const card = getByTestId('card-android');
      expect(card.props.style).toBe(customStyle);
    });

    it('should pass through rest props on Android', () => {
      const { getByTestId } = renderWithTheme(
        <CardAndroid testID="card-android" data-custom="test">
          <Text>Content</Text>
        </CardAndroid>
      );
      const card = getByTestId('card-android');
      expect(card.props['data-custom']).toBe('test');
    });
  });

  describe('iOS platform', () => {
    it('should render iOS component', () => {
      const { getByText } = renderWithTheme(
        <CardIOS testID="card-ios">
          <Text>iOS Content</Text>
        </CardIOS>
      );
      expect(getByText('iOS Content')).toBeTruthy();
    });

    it('should render elevated variant on iOS', () => {
      const { getByText } = renderWithTheme(
        <CardIOS variant={VARIANTS.ELEVATED}>
          <Text>Elevated Card</Text>
        </CardIOS>
      );
      expect(getByText('Elevated Card')).toBeTruthy();
    });

    it('should render outlined variant on iOS', () => {
      const { getByText } = renderWithTheme(
        <CardIOS variant={VARIANTS.OUTLINED}>
          <Text>Outlined Card</Text>
        </CardIOS>
      );
      expect(getByText('Outlined Card')).toBeTruthy();
    });

    it('should default to elevated variant on iOS', () => {
      const { getByText } = renderWithTheme(
        <CardIOS>
          <Text>Default Card</Text>
        </CardIOS>
      );
      expect(getByText('Default Card')).toBeTruthy();
    });

    it('should have article accessibility role on iOS', () => {
      const { getByTestId } = renderWithTheme(
        <CardIOS testID="card-ios">
          <Text>Content</Text>
        </CardIOS>
      );
      const card = getByTestId('card-ios');
      expect(card.props.accessibilityRole).toBe('article');
    });

    it('should have custom accessibility label on iOS', () => {
      const { getByLabelText } = renderWithTheme(
        <CardIOS accessibilityLabel="iOS Card">
          <Text>Content</Text>
        </CardIOS>
      );
      expect(getByLabelText('iOS Card')).toBeTruthy();
    });

    it('should have accessibility hint on iOS', () => {
      const { getByTestId } = renderWithTheme(
        <CardIOS testID="card-ios" accessibilityHint="This is an iOS card">
          <Text>Content</Text>
        </CardIOS>
      );
      const card = getByTestId('card-ios');
      expect(card.props.accessibilityHint).toBe('This is an iOS card');
    });

    it('should render header on iOS', () => {
      const { getByText } = renderWithTheme(
        <CardIOS header={<Text>iOS Header</Text>}>
          <Text>Body</Text>
        </CardIOS>
      );
      expect(getByText('iOS Header')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
    });

    it('should render footer on iOS', () => {
      const { getByText } = renderWithTheme(
        <CardIOS footer={<Text>iOS Footer</Text>}>
          <Text>Body</Text>
        </CardIOS>
      );
      expect(getByText('iOS Footer')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
    });

    it('should render all sections on iOS', () => {
      const { getByText } = renderWithTheme(
        <CardIOS
          header={<Text>Header</Text>}
          footer={<Text>Footer</Text>}
        >
          <Text>Body</Text>
        </CardIOS>
      );
      expect(getByText('Header')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });

    it('should accept style prop on iOS', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = renderWithTheme(
        <CardIOS testID="card-ios" style={customStyle}>
          <Text>Content</Text>
        </CardIOS>
      );
      const card = getByTestId('card-ios');
      expect(card.props.style).toBe(customStyle);
    });

    it('should pass through rest props on iOS', () => {
      const { getByTestId } = renderWithTheme(
        <CardIOS testID="card-ios" data-custom="test">
          <Text>Content</Text>
        </CardIOS>
      );
      const card = getByTestId('card-ios');
      expect(card.props['data-custom']).toBe('test');
    });
  });

  describe('Web platform', () => {
    it('should render Web component', () => {
      const { UNSAFE_getByType } = renderWithWebTheme(
        <CardWeb accessibilityLabel="Web Card">
          <Text>Web Content</Text>
        </CardWeb>
      );
      const card = UNSAFE_getByType(CardWeb);
      expect(card).toBeTruthy();
      expect(card.props.accessibilityLabel).toBe('Web Card');
    });

    it('should render elevated variant on Web', () => {
      const { UNSAFE_getByType } = renderWithWebTheme(
        <CardWeb variant={VARIANTS.ELEVATED} accessibilityLabel="Elevated Card">
          <Text>Elevated Card</Text>
        </CardWeb>
      );
      const card = UNSAFE_getByType(CardWeb);
      expect(card.props.variant).toBe(VARIANTS.ELEVATED);
    });

    it('should render outlined variant on Web', () => {
      const { UNSAFE_getByType } = renderWithWebTheme(
        <CardWeb variant={VARIANTS.OUTLINED} accessibilityLabel="Outlined Card">
          <Text>Outlined Card</Text>
        </CardWeb>
      );
      const card = UNSAFE_getByType(CardWeb);
      expect(card.props.variant).toBe(VARIANTS.OUTLINED);
    });

    it('should default to elevated variant on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <CardWeb accessibilityLabel="Default Card">
          <Text>Default Card</Text>
        </CardWeb>
      );
      const card = getByLabelText('Default Card');
      expect(card).toBeTruthy();
      // Component uses default variant internally
    });

    it('should have article role on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <CardWeb accessibilityLabel="Web Card">
          <Text>Content</Text>
        </CardWeb>
      );
      const card = getByLabelText('Web Card');
      expect(card.props.role).toBe('article');
    });

    it('should accept aria-label on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <CardWeb aria-label="Web Card">
          <Text>Content</Text>
        </CardWeb>
      );
      expect(getByLabelText('Web Card')).toBeTruthy();
    });

    it('should accept accessibilityLabel as aria-label on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <CardWeb accessibilityLabel="Web Card via accessibilityLabel">
          <Text>Content</Text>
        </CardWeb>
      );
      expect(getByLabelText('Web Card via accessibilityLabel')).toBeTruthy();
    });

    it('should have aria-description on Web', () => {
      const { UNSAFE_getByType } = renderWithWebTheme(
        <CardWeb accessibilityLabel="Web Card" accessibilityHint="This is a web card">
          <Text>Content</Text>
        </CardWeb>
      );
      const card = UNSAFE_getByType(CardWeb);
      expect(card).toBeTruthy();
      expect(card.props.accessibilityHint).toBe('This is a web card');
    });

    it('should render header on Web', () => {
      const { getByText } = renderWithWebTheme(
        <CardWeb header={<Text>Web Header</Text>} accessibilityLabel="Web Card">
          <Text>Body</Text>
        </CardWeb>
      );
      expect(getByText('Web Header')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
    });

    it('should render footer on Web', () => {
      const { getByText } = renderWithWebTheme(
        <CardWeb footer={<Text>Web Footer</Text>} accessibilityLabel="Web Card">
          <Text>Body</Text>
        </CardWeb>
      );
      expect(getByText('Web Footer')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
    });

    it('should render all sections on Web', () => {
      const { getByText } = renderWithWebTheme(
        <CardWeb
          header={<Text>Header</Text>}
          footer={<Text>Footer</Text>}
          accessibilityLabel="Web Card"
        >
          <Text>Body</Text>
        </CardWeb>
      );
      expect(getByText('Header')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });

    it('should accept className prop on Web', () => {
      const { UNSAFE_getByType } = renderWithWebTheme(
        <CardWeb accessibilityLabel="Web Card" className="custom-class">
          <Text>Content</Text>
        </CardWeb>
      );
      const card = UNSAFE_getByType(CardWeb);
      expect(card.props.className).toBe('custom-class');
    });

    it('should accept style prop on Web', () => {
      const customStyle = { marginTop: 10 };
      const { UNSAFE_getByType } = renderWithWebTheme(
        <CardWeb accessibilityLabel="Web Card" style={customStyle}>
          <Text>Content</Text>
        </CardWeb>
      );
      const card = UNSAFE_getByType(CardWeb);
      expect(card.props.style).toBe(customStyle);
    });

    it('should pass through rest props on Web', () => {
      const { UNSAFE_getByType } = renderWithWebTheme(
        <CardWeb accessibilityLabel="Web Card" data-custom="test">
          <Text>Content</Text>
        </CardWeb>
      );
      const card = UNSAFE_getByType(CardWeb);
      expect(card.props['data-custom']).toBe('test');
    });

    it('should accept testID prop on Web', () => {
      const { UNSAFE_getByType } = renderWithWebTheme(
        <CardWeb testID="web-card" accessibilityLabel="Web Card">
          <Text>Content</Text>
        </CardWeb>
      );
      const card = UNSAFE_getByType(CardWeb);
      expect(card).toBeTruthy();
      expect(card.props.testID).toBe('web-card');
    });
  });

  describe('Composition behavior', () => {
    it('should render body content', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <Text>Body Content</Text>
        </Card>
      );
      expect(getByText('Body Content')).toBeTruthy();
    });

    it('should render header', () => {
      const { getByText } = renderWithTheme(
        <Card header={<Text>Header</Text>}>
          <Text>Body</Text>
        </Card>
      );
      expect(getByText('Header')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
    });

    it('should render footer', () => {
      const { getByText } = renderWithTheme(
        <Card footer={<Text>Footer</Text>}>
          <Text>Body</Text>
        </Card>
      );
      expect(getByText('Footer')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
    });

    it('should render all sections', () => {
      const { getByText } = renderWithTheme(
        <Card
          header={<Text>Header</Text>}
          footer={<Text>Footer</Text>}
        >
          <Text>Body</Text>
        </Card>
      );
      expect(getByText('Header')).toBeTruthy();
      expect(getByText('Body')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });

    it('should render only header', () => {
      const { getByText } = renderWithTheme(
        <Card header={<Text>Header Only</Text>} />
      );
      expect(getByText('Header Only')).toBeTruthy();
    });

    it('should render only footer', () => {
      const { getByText } = renderWithTheme(
        <Card footer={<Text>Footer Only</Text>} />
      );
      expect(getByText('Footer Only')).toBeTruthy();
    });

    it('should handle empty body with header and footer', () => {
      const { getByText } = renderWithTheme(
        <Card
          header={<Text>Header</Text>}
          footer={<Text>Footer</Text>}
        />
      );
      expect(getByText('Header')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });
  });

  describe('Test ID', () => {
    it('should accept testID prop', () => {
      const { getByTestId } = renderWithTheme(
        <Card testID="test-card" accessibilityLabel="Test Card">
          <Text>Content</Text>
        </Card>
      );
      const card = getByTestId('test-card');
      expect(card.props.testID).toBe('test-card');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined variant gracefully', () => {
      const { getByText } = renderWithTheme(
        <Card variant={undefined}>
          <Text>Content</Text>
        </Card>
      );
      expect(getByText('Content')).toBeTruthy();
    });

    it('should handle missing accessibility label', () => {
      const { getByText } = renderWithTheme(
        <Card testID="card">
          <Text>Content</Text>
        </Card>
      );
      expect(getByText('Content')).toBeTruthy();
    });

    it('should handle null children', () => {
      const { getByTestId } = renderWithTheme(
        <Card testID="card" accessibilityLabel="Card">{null}</Card>
      );
      expect(getByTestId('card')).toBeTruthy();
    });

    it('should handle undefined header', () => {
      const { getByText } = renderWithTheme(
        <Card header={undefined}>
          <Text>Body</Text>
        </Card>
      );
      expect(getByText('Body')).toBeTruthy();
    });

    it('should handle undefined footer', () => {
      const { getByText } = renderWithTheme(
        <Card footer={undefined}>
          <Text>Body</Text>
        </Card>
      );
      expect(getByText('Body')).toBeTruthy();
    });
  });

  describe('Constants Export', () => {
    it('should export VARIANTS constant', () => {
      expect(VARIANTS).toBeDefined();
      expect(VARIANTS.ELEVATED).toBe('elevated');
      expect(VARIANTS.OUTLINED).toBe('outlined');
    });
  });

  describe('Index exports', () => {
    it('should export default component from index', () => {
      const DefaultCard = require('@platform/components/display/Card').default;
      expect(DefaultCard).toBeDefined();
      const { getByText } = renderWithTheme(
        <DefaultCard testID="index-card" accessibilityLabel="Index Card">
          <Text>Index Content</Text>
        </DefaultCard>
      );
      expect(getByText('Index Content')).toBeTruthy();
    });

    it('should export VARIANTS from index', () => {
      const IndexVARIANTS = require('@platform/components/display/Card').VARIANTS;
      expect(IndexVARIANTS).toBeDefined();
      expect(IndexVARIANTS).toBe(VARIANTS);
      expect(IndexVARIANTS.ELEVATED).toBe('elevated');
      expect(IndexVARIANTS.OUTLINED).toBe('outlined');
    });
  });

  describe('Style coverage - all conditional branches', () => {
    describe('Web platform style branches', () => {
      it('should render elevated variant with shadow styles', () => {
        const { UNSAFE_getByType } = renderWithWebTheme(
          <CardWeb variant={VARIANTS.ELEVATED} accessibilityLabel="Elevated Card">
            <Text>Content</Text>
          </CardWeb>
        );
        const card = UNSAFE_getByType(CardWeb);
        expect(card.props.variant).toBe(VARIANTS.ELEVATED);
      });

      it('should render outlined variant with border styles', () => {
        const { UNSAFE_getByType } = renderWithWebTheme(
          <CardWeb variant={VARIANTS.OUTLINED} accessibilityLabel="Outlined Card">
            <Text>Content</Text>
          </CardWeb>
        );
        const card = UNSAFE_getByType(CardWeb);
        expect(card.props.variant).toBe(VARIANTS.OUTLINED);
      });

      it('should render header with border when body exists', () => {
        const { getByText } = renderWithWebTheme(
          <CardWeb header={<Text>Header</Text>} accessibilityLabel="Card">
            <Text>Body</Text>
          </CardWeb>
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Body')).toBeTruthy();
      });

      it('should render header with border when footer exists', () => {
        const { getByText } = renderWithWebTheme(
          <CardWeb header={<Text>Header</Text>} footer={<Text>Footer</Text>} accessibilityLabel="Card" />
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
      });

      it('should render header without border when no body or footer', () => {
        const { getByText } = renderWithWebTheme(
          <CardWeb header={<Text>Header Only</Text>} accessibilityLabel="Card" />
        );
        expect(getByText('Header Only')).toBeTruthy();
      });

      it('should render body with padding-top: 0 when header exists', () => {
        const { getByText } = renderWithWebTheme(
          <CardWeb header={<Text>Header</Text>} accessibilityLabel="Card">
            <Text>Body</Text>
          </CardWeb>
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Body')).toBeTruthy();
      });

      it('should render body with padding-bottom: 0 when footer exists', () => {
        const { getByText } = renderWithWebTheme(
          <CardWeb footer={<Text>Footer</Text>} accessibilityLabel="Card">
            <Text>Body</Text>
          </CardWeb>
        );
        expect(getByText('Body')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
      });

      it('should render body with both padding adjustments when header and footer exist', () => {
        const { getByText } = renderWithWebTheme(
          <CardWeb header={<Text>Header</Text>} footer={<Text>Footer</Text>} accessibilityLabel="Card">
            <Text>Body</Text>
          </CardWeb>
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Body')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
      });
    });

    describe('Android platform style branches', () => {
      it('should render elevated variant with shadow styles on Android', () => {
        const { getByTestId } = renderWithTheme(
          <CardAndroid variant={VARIANTS.ELEVATED} testID="card-android">
            <Text>Content</Text>
          </CardAndroid>
        );
        const card = getByTestId('card-android');
        expect(card.props.variant).toBe(VARIANTS.ELEVATED);
      });

      it('should render outlined variant with border styles on Android', () => {
        const { getByTestId } = renderWithTheme(
          <CardAndroid variant={VARIANTS.OUTLINED} testID="card-android">
            <Text>Content</Text>
          </CardAndroid>
        );
        const card = getByTestId('card-android');
        expect(card.props.variant).toBe(VARIANTS.OUTLINED);
      });

      it('should render header with border when body exists on Android', () => {
        const { getByText } = renderWithTheme(
          <CardAndroid header={<Text>Header</Text>} testID="card">
            <Text>Body</Text>
          </CardAndroid>
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Body')).toBeTruthy();
      });

      it('should render header with border when footer exists on Android', () => {
        const { getByText } = renderWithTheme(
          <CardAndroid header={<Text>Header</Text>} footer={<Text>Footer</Text>} testID="card" />
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
      });

      it('should render header without border when no body or footer on Android', () => {
        const { getByText } = renderWithTheme(
          <CardAndroid header={<Text>Header Only</Text>} testID="card" />
        );
        expect(getByText('Header Only')).toBeTruthy();
      });

      it('should render body with padding-top: 0 when header exists on Android', () => {
        const { getByText } = renderWithTheme(
          <CardAndroid header={<Text>Header</Text>} testID="card">
            <Text>Body</Text>
          </CardAndroid>
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Body')).toBeTruthy();
      });

      it('should render body with padding-bottom: 0 when footer exists on Android', () => {
        const { getByText } = renderWithTheme(
          <CardAndroid footer={<Text>Footer</Text>} testID="card">
            <Text>Body</Text>
          </CardAndroid>
        );
        expect(getByText('Body')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
      });
    });

    describe('iOS platform style branches', () => {
      it('should render elevated variant with shadow styles on iOS', () => {
        const { getByTestId } = renderWithTheme(
          <CardIOS variant={VARIANTS.ELEVATED} testID="card-ios">
            <Text>Content</Text>
          </CardIOS>
        );
        const card = getByTestId('card-ios');
        expect(card.props.variant).toBe(VARIANTS.ELEVATED);
      });

      it('should render outlined variant with border styles on iOS', () => {
        const { getByTestId } = renderWithTheme(
          <CardIOS variant={VARIANTS.OUTLINED} testID="card-ios">
            <Text>Content</Text>
          </CardIOS>
        );
        const card = getByTestId('card-ios');
        expect(card.props.variant).toBe(VARIANTS.OUTLINED);
      });

      it('should render header with border when body exists on iOS', () => {
        const { getByText } = renderWithTheme(
          <CardIOS header={<Text>Header</Text>} testID="card">
            <Text>Body</Text>
          </CardIOS>
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Body')).toBeTruthy();
      });

      it('should render header with border when footer exists on iOS', () => {
        const { getByText } = renderWithTheme(
          <CardIOS header={<Text>Header</Text>} footer={<Text>Footer</Text>} testID="card" />
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
      });

      it('should render header without border when no body or footer on iOS', () => {
        const { getByText } = renderWithTheme(
          <CardIOS header={<Text>Header Only</Text>} testID="card" />
        );
        expect(getByText('Header Only')).toBeTruthy();
      });

      it('should render body with padding-top: 0 when header exists on iOS', () => {
        const { getByText } = renderWithTheme(
          <CardIOS header={<Text>Header</Text>} testID="card">
            <Text>Body</Text>
          </CardIOS>
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Body')).toBeTruthy();
      });

      it('should render body with padding-bottom: 0 when footer exists on iOS', () => {
        const { getByText } = renderWithTheme(
          <CardIOS footer={<Text>Footer</Text>} testID="card">
            <Text>Body</Text>
          </CardIOS>
        );
        expect(getByText('Body')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
      });
    });
  });
});

