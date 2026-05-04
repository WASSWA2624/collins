/**
 * Accordion Component - Web
 * Collapsible content sections
 * File: Accordion.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 4. Styles (relative import - platform-specific)
import { StyledAccordion, StyledAccordionHeader, StyledAccordionContent, StyledAccordionIcon } from './Accordion.web.styles';

// 5. Component-specific hook (relative import)
import useAccordion from './useAccordion';

/**
 * Accordion component for Web
 * @param {Object} props - Accordion props
 * @param {string} props.title - Accordion header title
 * @param {React.ReactNode} props.children - Accordion content
 * @param {boolean} props.defaultExpanded - Default expanded state
 * @param {boolean} props.expanded - Controlled expanded state
 * @param {Function} props.onChange - Change handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const AccordionWeb = ({
  title,
  children,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onChange,
  accessibilityLabel,
  testID,
  className,
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
      className={className}
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
        {title}
      </StyledAccordionHeader>
      {expanded && (
        <StyledAccordionContent testID={testID ? `${testID}-content` : undefined}>
          {children}
        </StyledAccordionContent>
      )}
    </StyledAccordion>
  );
};

export default AccordionWeb;

