import React from 'react';

const FLAG_WIDTH = 22;
const FLAG_HEIGHT = 16;
const BORDER = '#c7ced8';

const flagStyle = {
  width: FLAG_WIDTH,
  height: FLAG_HEIGHT,
  display: 'block',
  flexShrink: 0,
};

const horizontalBands = (colors) =>
  colors.map((color, index) => (
    <rect
      key={`${color}-${index}`}
      x="0"
      y={(FLAG_HEIGHT / colors.length) * index}
      width={FLAG_WIDTH}
      height={FLAG_HEIGHT / colors.length}
      fill={color}
    />
  ));

const verticalBands = (colors) =>
  colors.map((color, index) => (
    <rect
      key={`${color}-${index}`}
      x={(FLAG_WIDTH / colors.length) * index}
      y="0"
      width={FLAG_WIDTH / colors.length}
      height={FLAG_HEIGHT}
      fill={color}
    />
  ));

const starPoints = (cx, cy, outerRadius, innerRadius = outerRadius * 0.45) =>
  Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  }).join(' ');

const Border = () => (
  <rect
    x="0.5"
    y="0.5"
    width={FLAG_WIDTH - 1}
    height={FLAG_HEIGHT - 1}
    fill="none"
    stroke={BORDER}
    strokeWidth="1"
  />
);

const FlagShell = ({ children }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    style={flagStyle}
    viewBox={`0 0 ${FLAG_WIDTH} ${FLAG_HEIGHT}`}
  >
    {children}
    <Border />
  </svg>
);

const LocaleFlagIcon = ({ countryCode = 'WORLD' }) => {
  const code = String(countryCode || 'WORLD').toUpperCase();

  if (code === 'GB') {
    return (
      <FlagShell>
        <rect width={FLAG_WIDTH} height={FLAG_HEIGHT} fill="#012169" />
        <line x1="-2" y1="-1" x2="24" y2="17" stroke="#fff" strokeWidth="4" />
        <line x1="24" y1="-1" x2="-2" y2="17" stroke="#fff" strokeWidth="4" />
        <line x1="-2" y1="-1" x2="24" y2="17" stroke="#c8102e" strokeWidth="2" />
        <line x1="24" y1="-1" x2="-2" y2="17" stroke="#c8102e" strokeWidth="2" />
        <rect x="0" y="6" width={FLAG_WIDTH} height="4" fill="#fff" />
        <rect x="9" y="0" width="4" height={FLAG_HEIGHT} fill="#fff" />
        <rect x="0" y="7" width={FLAG_WIDTH} height="2" fill="#c8102e" />
        <rect x="10" y="0" width="2" height={FLAG_HEIGHT} fill="#c8102e" />
      </FlagShell>
    );
  }

  if (code === 'SA') {
    return (
      <FlagShell>
        <rect width={FLAG_WIDTH} height={FLAG_HEIGHT} fill="#006c35" />
        <rect x="6" y="10" width="10" height="1.5" fill="#fff" />
      </FlagShell>
    );
  }

  if (code === 'ES') {
    return (
      <FlagShell>
        {horizontalBands(['#aa151b', '#f1bf00', '#f1bf00', '#aa151b'])}
      </FlagShell>
    );
  }

  if (code === 'IR') {
    return (
      <FlagShell>
        {horizontalBands(['#239f40', '#fff', '#da0000'])}
      </FlagShell>
    );
  }

  if (code === 'IN') {
    return (
      <FlagShell>
        {horizontalBands(['#ff9933', '#fff', '#138808'])}
        <circle cx="11" cy="8" r="1.7" fill="none" stroke="#000080" strokeWidth="0.8" />
      </FlagShell>
    );
  }

  if (code === 'JP') {
    return (
      <FlagShell>
        <rect width={FLAG_WIDTH} height={FLAG_HEIGHT} fill="#fff" />
        <circle cx="11" cy="8" r="4" fill="#bc002d" />
      </FlagShell>
    );
  }

  if (code === 'KR') {
    return (
      <FlagShell>
        <rect width={FLAG_WIDTH} height={FLAG_HEIGHT} fill="#fff" />
        <path d="M11 5a3 3 0 0 1 0 6a3 3 0 0 1 0-6" fill="#c60c30" />
        <path d="M11 5a3 3 0 0 0 0 6a3 3 0 0 0 0-6" fill="#003478" opacity="0.9" />
        <rect x="3" y="3" width="4" height="1" fill="#111" />
        <rect x="15" y="12" width="4" height="1" fill="#111" />
      </FlagShell>
    );
  }

  if (code === 'MY') {
    return (
      <FlagShell>
        {horizontalBands(['#cc0001', '#fff', '#cc0001', '#fff', '#cc0001', '#fff', '#cc0001'])}
        <rect x="0" y="0" width="9" height="9" fill="#010066" />
        <circle cx="4.5" cy="4.5" r="2.1" fill="#ffcc00" />
      </FlagShell>
    );
  }

  if (code === 'PT') {
    return (
      <FlagShell>
        <rect width="9" height={FLAG_HEIGHT} fill="#006600" />
        <rect x="9" width="13" height={FLAG_HEIGHT} fill="#ff0000" />
        <circle cx="9" cy="8" r="2.2" fill="#ffcc00" />
      </FlagShell>
    );
  }

  if (code === 'TZ') {
    return (
      <FlagShell>
        <polygon points="0,0 22,0 0,16" fill="#1eb53a" />
        <polygon points="22,0 22,16 0,16" fill="#00a3dd" />
        <polygon points="-2,13 18,-2 24,3 4,18" fill="#fcd116" />
        <polygon points="-1,14 19,-1 23,2 3,17" fill="#000" />
      </FlagShell>
    );
  }

  if (code === 'TR') {
    return (
      <FlagShell>
        <rect width={FLAG_WIDTH} height={FLAG_HEIGHT} fill="#e30a17" />
        <circle cx="8.5" cy="8" r="3.6" fill="#fff" />
        <circle cx="9.8" cy="8" r="3" fill="#e30a17" />
        <polygon points={starPoints(14.8, 8, 1.9)} fill="#fff" />
      </FlagShell>
    );
  }

  if (code === 'VN') {
    return (
      <FlagShell>
        <rect width={FLAG_WIDTH} height={FLAG_HEIGHT} fill="#da251d" />
        <polygon points={starPoints(11, 8, 4)} fill="#ffde00" />
      </FlagShell>
    );
  }

  if (code === 'CN') {
    return (
      <FlagShell>
        <rect width={FLAG_WIDTH} height={FLAG_HEIGHT} fill="#de2910" />
        <polygon points={starPoints(5, 5, 2.8)} fill="#ffde00" />
        <circle cx="10" cy="3.5" r="0.8" fill="#ffde00" />
        <circle cx="12" cy="5.7" r="0.8" fill="#ffde00" />
        <circle cx="12" cy="8.8" r="0.8" fill="#ffde00" />
      </FlagShell>
    );
  }

  if (code === 'WORLD') {
    return (
      <FlagShell>
        <rect width={FLAG_WIDTH} height={FLAG_HEIGHT} fill="#eef2f7" />
        <circle cx="11" cy="8" r="5" fill="#5b8def" />
        <path d="M6 8h10M11 3c2 3 2 7 0 10M11 3c-2 3-2 7 0 10" stroke="#fff" strokeWidth="1" />
      </FlagShell>
    );
  }

  const simpleFlags = {
    DE: ['#000', '#dd0000', '#ffce00'],
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

  if (simpleFlags[code]) {
    return <FlagShell>{horizontalBands(simpleFlags[code])}</FlagShell>;
  }

  if (verticalFlags[code]) {
    return <FlagShell>{verticalBands(verticalFlags[code])}</FlagShell>;
  }

  return <LocaleFlagIcon countryCode="WORLD" />;
};

export default LocaleFlagIcon;
