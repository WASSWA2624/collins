import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';

const { buildDashboardWindow } = await import('../src/modules/dashboards/dashboards.service.js');

test('dashboard window includes each calendar day in the requested range', () => {
  const window = buildDashboardWindow({
    from: new Date('2026-05-01T12:00:00Z'),
    to: new Date('2026-05-03T12:00:00Z'),
  });

  assert.equal(window.days.length, 3);
  assert.equal(window.days[0].toISOString().slice(0, 10), '2026-05-01');
  assert.equal(window.days[2].toISOString().slice(0, 10), '2026-05-03');
});

test('dashboard window rejects ranges beyond the dashboard maximum', () => {
  assert.throws(
    () => buildDashboardWindow({
      from: new Date('2026-01-01T00:00:00Z'),
      to: new Date('2026-05-01T00:00:00Z'),
    }),
    /cannot exceed 90 days/,
  );
});
