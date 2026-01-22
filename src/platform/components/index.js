/**
 * Platform Components Barrel Export
 * Centralized exports for all platform components
 * File: index.js
 * 
 * Components are organized into related groups:
 * - forms: Form input components
 * - navigation: Navigation components
 * - feedback: Feedback/status components
 * - display: Display components
 * - layout: Layout components
 * - states: State components (empty, error, offline)
 */

// Form Components
export { default as Button, useButton, VARIANTS as ButtonVariants, SIZES as ButtonSizes, STATES as ButtonStates } from './forms/Button';
export { default as TextField } from './forms/TextField';
export { default as TextArea } from './forms/TextArea';
export { default as PasswordField, usePasswordField } from './forms/PasswordField';
export { default as Checkbox } from './forms/Checkbox';
export { default as Radio } from './forms/Radio';
export { default as Switch } from './forms/Switch';
export { default as Select } from './forms/Select';
export { default as Dropdown } from './forms/Dropdown';
export { default as Slider } from './forms/Slider';

// Navigation Components
export { default as GlobalHeader } from './navigation/GlobalHeader';
export { default as GlobalFooter } from './navigation/GlobalFooter';
export { default as Sidebar } from './navigation/Sidebar';
export { default as TabBar } from './navigation/TabBar';
export { default as Tabs } from './navigation/Tabs';
export { default as Tab } from './navigation/Tab';
export { default as Breadcrumbs } from './navigation/Breadcrumbs';
export { default as Navigation } from './navigation/Navigation';
export { default as ThemeControls } from './navigation/ThemeControls';
export { default as LanguageControls } from './navigation/LanguageControls';

// Feedback Components
export { default as Toast } from './feedback/Toast';
export { default as Snackbar } from './feedback/Snackbar';
export { default as Modal, useModal } from './feedback/Modal';
export { default as Tooltip } from './feedback/Tooltip';
export { default as LoadingSpinner } from './feedback/LoadingSpinner';
export { default as ProgressBar } from './feedback/ProgressBar';
export { default as Skeleton } from './feedback/Skeleton';
export { default as SystemBanner } from './feedback/SystemBanner';
export { default as ShellBanners } from './feedback/ShellBanners';
export { default as LoadingOverlay } from './feedback/LoadingOverlay';
export { default as NoticeSurface } from './feedback/NoticeSurface';
export { default as NetworkIndicator } from './feedback/NetworkIndicator';

// Display Components
export { default as Text } from './display/Text';
export { default as Image } from './display/Image';
export { default as Icon } from './display/Icon';
export { default as Avatar } from './display/Avatar';
export { default as Badge } from './display/Badge';
export { default as Chip } from './display/Chip';
export { default as Card } from './display/Card';
export { default as List } from './display/List';
export { default as ListItem } from './display/ListItem';
export { default as Accordion } from './display/Accordion';

// Layout Components
export { default as Container } from './layout/Container';
export { default as Stack } from './layout/Stack';
export { default as Spacer } from './layout/Spacer';
export { default as Divider, ORIENTATIONS } from './layout/Divider';
export { default as Screen } from './layout/Screen';
export { default as AuthFormLayout, SIZES as AuthFormLayoutSizes } from './layout/AuthFormLayout';

// State Components  
export { default as EmptyState } from './states/EmptyState';
export { SIZES as EmptyStateSizes } from './states/EmptyState';
export { default as ErrorState } from './states/ErrorState';
export { SIZES as ErrorStateSizes } from './states/ErrorState';
export { default as OfflineState } from './states/OfflineState';
export { SIZES as OfflineStateSizes } from './states/OfflineState';
