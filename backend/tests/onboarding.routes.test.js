import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createApp } from '../src/app.js';

const withAppServer = async (callback) => {
  const server = createServer(createApp());

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    return await callback(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
};

test('onboarding config exposes non-clinical first-run metadata', async () => {
  await withAppServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/onboarding/config`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.clinicalRecommendationsEnabled, false);
    assert.equal(body.data.requiredAcknowledgements[0].code, 'CLINICAL_SAFETY');
    assert.match(body.data.requiredAcknowledgements[0].statement, /advisory safety prompts only/i);
    assert.doesNotMatch(JSON.stringify(body.data), /patient|admission|dataset/i);
  });
});

test('persisted onboarding state requires authentication before any state access', async () => {
  await withAppServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/onboarding/state`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.match(body.message, /authentication required/i);
  });
});
