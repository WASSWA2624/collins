/**
 * HomeScreen Web Styles
 * Word-like document layout: full-bleed container, elegant content area.
 * File: HomeScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledLogoArea = styled.div.withConfig({
  displayName: 'StyledLogoArea',
  componentId: 'StyledLogoArea',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledMessage = styled.div.withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const StyledOverview = styled.section.withConfig({
  displayName: 'StyledOverview',
  componentId: 'StyledOverview',
})`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledOverviewTitle = styled.h2.withConfig({
  displayName: 'StyledOverviewTitle',
  componentId: 'StyledOverviewTitle',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.lg ?? 18}px;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md}px 0;
`;

const StyledSectionList = styled.div.withConfig({
  displayName: 'StyledSectionList',
  componentId: 'StyledSectionList',
})`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSectionItem = styled.a.withConfig({
  displayName: 'StyledSectionItem',
  componentId: 'StyledSectionItem',
})`
  display: block;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.lg ?? 12}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  box-shadow: ${({ theme }) => theme.shadows?.sm ?? '0 1px 3px rgba(0,0,0,0.06)'};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows?.md ?? '0 4px 12px rgba(0,0,0,0.08)'};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledSectionTitle = styled.span.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.md ?? 16}px;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledSectionDesc = styled.p.withConfig({
  displayName: 'StyledSectionDesc',
  componentId: 'StyledSectionDesc',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs}px 0 0 0;
  line-height: 1.4;
`;

export {
  StyledContainer,
  StyledContent,
  StyledLogoArea,
  StyledMessage,
  StyledOverview,
  StyledOverviewTitle,
  StyledSectionList,
  StyledSectionItem,
  StyledSectionTitle,
  StyledSectionDesc,
};

