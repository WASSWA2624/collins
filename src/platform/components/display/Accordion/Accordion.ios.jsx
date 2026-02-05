/**
 * Accordion Component - iOS
 * Collapsible content sections
 * File: Accordion.ios.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components
import { Text } from '@platform/components';

// 4. Styles (relative import - platform-specific)
import { StyledAccordion, StyledAccordionHeader, StyledAccordionContent, StyledAccordionIcon } from './Accordion.ios.styles';

// 5. Component-specific hook (relative import)
import useAccordion from './useAccordion';

/**
 * Accordion component for iOS
 * @param {Object} props - Accordion props
 * @param {string} props.title - Accordion header title
 * @param {React.ReactNode} props.children - Accordion content
 * @param {boolean} props.defaultExpanded - Default expanded state
 * @param {boolean} props.expanded - Controlled expanded state
 * @param {Function} props.onChange - Change handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const AccordionIOS = ({
  title,
  children,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onChange,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { expanded: internalExpanded, toggle } = useAccordion({
    defaultExpanded,
    onChange,
  });

  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  return (
    <StyledAccordion
      accessibilityRole="region"
      accessibilityLabel={accessibilityLabel || title}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledAccordionHeader
        onPress={toggle}
        accessibilityRole="button"
        accessibilityExpanded={expanded}
        accessibilityLabel={title}
        testID={testID ? `${testID}-header` : undefined}
      >
        <StyledAccordionIcon expanded={expanded}>▼</StyledAccordionIcon>
        <Text variant="body">{title}</Text>
      </StyledAccordionHeader>
      {expanded && (
        <StyledAccordionContent testID={testID ? `${testID}-content` : undefined}>
          {children}
        </StyledAccordionContent>
      )}
    </StyledAccordion>
  );
};

export default AccordionIOS;

