import React from 'react';
import { View } from 'react-native';

const FLAG_WIDTH = 22;
const FLAG_HEIGHT = 16;
const BORDER = '#c7ced8';

const baseFlag = {
  width: FLAG_WIDTH,
  height: FLAG_HEIGHT,
  borderWidth: 1,
  borderColor: BORDER,
  overflow: 'hidden',
  flexShrink: 0,
  backgroundColor: '#eef2f7',
};

const absoluteFill = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const Band = ({ color, style }) => (
  <View pointerEvents="none" style={[{ flex: 1, backgroundColor: color }, style]} />
);

const Shape = ({ color, style }) => (
  <View pointerEvents="none" style={[{ backgroundColor: color }, style]} />
);

const FlagShell = ({ children, style }) => (
  <View
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    pointerEvents="none"
    style={[baseFlag, style]}
  >
    {children}
  </View>
);

const HorizontalFlag = ({ colors }) => (
  <FlagShell style={{ flexDirection: 'column' }}>
    {colors.map((color, index) => (
      <Band key={`${color}-${index}`} color={color} />
    ))}
  </FlagShell>
);

const VerticalFlag = ({ colors }) => (
  <FlagShell style={{ flexDirection: 'row' }}>
    {colors.map((color, index) => (
      <Band key={`${color}-${index}`} color={color} />
    ))}
  </FlagShell>
);

const LocaleFlagIcon = ({ countryCode = 'WORLD' }) => {
  const code = String(countryCode || 'WORLD').toUpperCase();

  if (code === 'GB') {
    return (
      <FlagShell style={{ backgroundColor: '#012169' }}>
        <Shape color="#fff" style={[absoluteFill, { top: 6, bottom: 6 }]} />
        <Shape color="#fff" style={[absoluteFill, { left: 9, right: 9 }]} />
        <Shape color="#c8102e" style={[absoluteFill, { top: 7, bottom: 7 }]} />
        <Shape color="#c8102e" style={[absoluteFill, { left: 10, right: 10 }]} />
      </FlagShell>
    );
  }

  if (code === 'SA') {
    return (
      <FlagShell style={{ backgroundColor: '#006c35' }}>
        <Shape
          color="#fff"
          style={{ position: 'absolute', left: 6, right: 6, bottom: 4, height: 1.5 }}
        />
      </FlagShell>
    );
  }

  if (code === 'IN') {
    return (
      <FlagShell style={{ flexDirection: 'column' }}>
        <Band color="#ff9933" />
        <Band color="#fff" />
        <Band color="#138808" />
        <Shape
          color="#000080"
          style={{
            position: 'absolute',
            left: 9,
            top: 6,
            width: 4,
            height: 4,
            borderRadius: 2,
          }}
        />
      </FlagShell>
    );
  }

  if (code === 'JP') {
    return (
      <FlagShell style={{ backgroundColor: '#fff' }}>
        <Shape
          color="#bc002d"
          style={{
            position: 'absolute',
            left: 7,
            top: 4,
            width: 8,
            height: 8,
            borderRadius: 4,
          }}
        />
      </FlagShell>
    );
  }

  if (code === 'MY') {
    return (
      <FlagShell style={{ flexDirection: 'column' }}>
        {['#cc0001', '#fff', '#cc0001', '#fff', '#cc0001', '#fff', '#cc0001'].map(
          (color, index) => (
            <Band key={`${color}-${index}`} color={color} />
          )
        )}
        <Shape color="#010066" style={{ position: 'absolute', left: 0, top: 0, width: 9, height: 9 }} />
        <Shape
          color="#ffcc00"
          style={{
            position: 'absolute',
            left: 3,
            top: 3,
            width: 4,
            height: 4,
            borderRadius: 2,
          }}
        />
      </FlagShell>
    );
  }

  if (code === 'PT') {
    return (
      <FlagShell style={{ flexDirection: 'row' }}>
        <Band color="#006600" style={{ flex: 0.42 }} />
        <Band color="#ff0000" style={{ flex: 0.58 }} />
        <Shape
          color="#ffcc00"
          style={{
            position: 'absolute',
            left: 7,
            top: 6,
            width: 4,
            height: 4,
            borderRadius: 2,
          }}
        />
      </FlagShell>
    );
  }

  if (code === 'TZ') {
    return (
      <FlagShell style={{ backgroundColor: '#1eb53a' }}>
        <Shape
          color="#00a3dd"
          style={{
            position: 'absolute',
            right: -7,
            bottom: -4,
            width: 28,
            height: 18,
            transform: [{ rotate: '-32deg' }],
          }}
        />
        <Shape
          color="#fcd116"
          style={{
            position: 'absolute',
            left: -5,
            top: 7,
            width: 32,
            height: 5,
            transform: [{ rotate: '-32deg' }],
          }}
        />
        <Shape
          color="#000"
          style={{
            position: 'absolute',
            left: -5,
            top: 8,
            width: 32,
            height: 3,
            transform: [{ rotate: '-32deg' }],
          }}
        />
      </FlagShell>
    );
  }

  if (code === 'TR') {
    return (
      <FlagShell style={{ backgroundColor: '#e30a17' }}>
        <Shape
          color="#fff"
          style={{
            position: 'absolute',
            left: 5,
            top: 4,
            width: 8,
            height: 8,
            borderRadius: 4,
          }}
        />
        <Shape
          color="#e30a17"
          style={{
            position: 'absolute',
            left: 7,
            top: 4,
            width: 8,
            height: 8,
            borderRadius: 4,
          }}
        />
        <Shape
          color="#fff"
          style={{
            position: 'absolute',
            left: 14,
            top: 7,
            width: 3,
            height: 3,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </FlagShell>
    );
  }

  if (code === 'VN') {
    return (
      <FlagShell style={{ backgroundColor: '#da251d' }}>
        <Shape
          color="#ffde00"
          style={{
            position: 'absolute',
            left: 9,
            top: 6,
            width: 5,
            height: 5,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </FlagShell>
    );
  }

  if (code === 'CN') {
    return (
      <FlagShell style={{ backgroundColor: '#de2910' }}>
        <Shape
          color="#ffde00"
          style={{
            position: 'absolute',
            left: 3,
            top: 4,
            width: 5,
            height: 5,
            transform: [{ rotate: '45deg' }],
          }}
        />
        <Shape color="#ffde00" style={{ position: 'absolute', left: 10, top: 3, width: 2, height: 2 }} />
        <Shape color="#ffde00" style={{ position: 'absolute', left: 12, top: 6, width: 2, height: 2 }} />
      </FlagShell>
    );
  }

  if (code === 'WORLD') {
    return (
      <FlagShell style={{ backgroundColor: '#eef2f7' }}>
        <Shape
          color="#5b8def"
          style={{
            position: 'absolute',
            left: 6,
            top: 3,
            width: 10,
            height: 10,
            borderRadius: 5,
          }}
        />
        <Shape color="#fff" style={{ position: 'absolute', left: 7, top: 8, width: 8, height: 1 }} />
        <Shape color="#fff" style={{ position: 'absolute', left: 10, top: 4, width: 1, height: 8 }} />
      </FlagShell>
    );
  }

  const horizontalFlags = {
    DE: ['#000', '#dd0000', '#ffce00'],
    ES: ['#aa151b', '#f1bf00', '#f1bf00', '#aa151b'],
    IR: ['#239f40', '#fff', '#da0000'],
    ID: ['#ce1126', '#fff'],
    NL: ['#ae1c28', '#fff', '#21468b'],
    PL: ['#fff', '#dc143c'],
    RU: ['#fff', '#0039a6', '#d52b1e'],
    TH: ['#a51931', '#fff', '#2d2a4a', '#2d2a4a', '#fff', '#a51931'],
    UA: ['#005bbb', '#ffd500'],
  };
  const verticalFlags = {
    FR: ['#0055a4', '#fff', '#ef4135'],
    IT: ['#009246', '#fff', '#ce2b37'],
  };

  if (horizontalFlags[code]) return <HorizontalFlag colors={horizontalFlags[code]} />;
  if (verticalFlags[code]) return <VerticalFlag colors={verticalFlags[code]} />;
  return <LocaleFlagIcon countryCode="WORLD" />;
};

export default LocaleFlagIcon;
