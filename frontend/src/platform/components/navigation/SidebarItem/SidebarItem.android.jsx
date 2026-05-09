import React from 'react';
import Icon from '@platform/components/display/Icon';
import { getMenuIconGlyph } from '@config/sideMenu';
import { Row, Icon as IconBox, Label } from './SidebarItem.android.styles.jsx';

const normalize = (props) => {
  if (props.item) {
    const { path, href, label, icon, id, testID } = props.item;
    return {
      id,
      path: path || href,
      label,
      icon,
      collapsed: props.collapsed,
      active: props.active,
      testID: props.testID || testID,
      onPress: props.onPress || props.onClick,
    };
  }
  return {
    path: props.path || props.href,
    label: props.label,
    icon: props.icon,
    collapsed: props.collapsed,
    active: props.active,
    testID: props.testID,
    onPress: props.onPress || props.onClick,
  };
};

const SidebarItemAndroid = (props) => {
  const { label, icon, collapsed, active, onPress, testID } = normalize(props);

  const handlePress = () => {
    if (onPress) onPress();
  };

  return (
    <Row
      onPress={handlePress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active }}
      active={active}
    >
      <IconBox active={active}>
        <Icon glyph={getMenuIconGlyph(icon)} size="sm" decorative />
      </IconBox>
      <Label active={active} collapsed={collapsed}>{label}</Label>
    </Row>
  );
};

export default SidebarItemAndroid;
