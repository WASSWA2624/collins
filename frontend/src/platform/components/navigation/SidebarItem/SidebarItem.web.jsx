import React from 'react';
import { useRouter } from 'expo-router';
import Icon from '@platform/components/display/Icon';
import { getMenuIconGlyph } from '@config/sideMenu';
import { Row, IconWrapper, Label } from './SidebarItem.web.styles.jsx';

const normalize = (props) => {
  if (props.item) {
    const { path, href, label, icon } = props.item;
    return {
      path: path || href,
      label,
      icon,
      collapsed: props.collapsed,
      active: props.active,
      onClick: props.onClick,
      onClose: props.onClose,
    };
  }
  return {
    path: props.path || props.href,
    label: props.label,
    icon: props.icon,
    collapsed: props.collapsed,
    active: props.active,
    onClick: props.onClick,
    onClose: props.onClose,
  };
};

const SidebarItemWeb = (props) => {
  const router = useRouter();
  const { path, label, icon, collapsed, active, onClick, onClose } = normalize(props);
  const glyph = getMenuIconGlyph(icon);
  const handleClick = (e) => {
    e?.preventDefault?.();
    if (onClick) onClick();
    else if (path) router.push(path);
    onClose?.();
  };
  return (
    <Row
      href={path || '#'}
      onClick={handleClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
      $active={active}
      $collapsed={collapsed}
    >
      <IconWrapper aria-hidden>
        <Icon glyph={glyph} size="sm" decorative />
      </IconWrapper>
      <Label $collapsed={collapsed} $active={active}>
        {label}
      </Label>
    </Row>
  );
};

export default SidebarItemWeb;
