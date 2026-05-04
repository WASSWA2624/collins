import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from '@platform/components/display/Icon';
import { getMenuIconGlyph } from '@config/sideMenu';
import { Row, Icon as IconBox, Label } from './SidebarItem.ios.styles.jsx';

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

const SidebarItemIOS = (props) => {
  const { label, icon, collapsed, active, onPress, testID } = normalize(props);

  const handlePress = () => {
    if (onPress) onPress();
    // Navigation logic can be handled at a higher level or by passing a handler via props
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      testID={testID}
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active }}
    >
      <Row active={active}>
        <IconBox>
          <Icon glyph={getMenuIconGlyph(icon)} size="sm" decorative />
        </IconBox>
        <Label collapsed={collapsed}>{label}</Label>
      </Row>
    </TouchableOpacity>
  );
};

export default SidebarItemIOS;