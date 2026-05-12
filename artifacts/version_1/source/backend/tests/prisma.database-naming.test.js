import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const schema = readFileSync(schemaPath, 'utf8');

const databaseIdentifierPattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
const modelBlocks = [...schema.matchAll(/^model\s+(\w+)\s+\{([\s\S]*?)^}/gm)];
const modelNames = new Set(modelBlocks.map(([, modelName]) => modelName));

const readMapName = (source, mapType) => {
  const match = source.match(new RegExp(`${mapType}\\(\\"([^\\"]+)\\"\\)`));
  return match?.[1];
};

const readScalarFields = (body) => body
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('@@') && !line.startsWith('//'))
  .map((line) => line.match(/^(\w+)\s+([^\s]+)(.*)$/))
  .filter(Boolean)
  .filter(([, , rawType]) => !modelNames.has(rawType.replace(/[?[\]]/g, '')));

test('Prisma physical table and scalar column names use lowercase_snake notation', () => {
  assert.notEqual(modelBlocks.length, 0);

  for (const [, modelName, body] of modelBlocks) {
    const tableName = readMapName(body, '@@map') ?? modelName;

    assert.match(
      tableName,
      databaseIdentifierPattern,
      `${modelName} maps to non-lowercase_snake table ${tableName}`,
    );

    for (const [, fieldName, , fieldConfig] of readScalarFields(body)) {
      const columnName = readMapName(fieldConfig, '@map') ?? fieldName;

      assert.match(
        columnName,
        databaseIdentifierPattern,
        `${modelName}.${fieldName} maps to non-lowercase_snake column ${columnName}`,
      );
    }
  }
});

test('Prisma keeps backend model fields stable while mapping database identifiers', () => {
  assert.match(schema, /model User \{[\s\S]*passwordHash\s+String\s+@map\("password_hash"\)/);
  assert.match(schema, /model User \{[\s\S]*@@map\("user"\)/);
  assert.match(schema, /model ClinicalSnapshot \{[\s\S]*@@map\("clinical_snapshot"\)/);
  assert.match(schema, /model AuditLog \{[\s\S]*@@map\("audit_log"\)/);
});
