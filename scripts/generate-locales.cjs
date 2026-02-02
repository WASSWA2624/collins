/**
 * One-off script: generate 22 locale files from en.json (same keys; values = en for fallback).
 * Run from project root: node scripts/generate-locales.cjs
 * Per P013: zh, es, fr, ar, ru, pt, de, ja, hi, it, ko, tr, vi, pl, fa, th, nl, id, ms, uk, sw, ta
 */
const fs = require('fs');
const path = require('path');

const LOCALES = [
  'ar', 'de', 'es', 'fa', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'ms', 'nl',
  'pl', 'pt', 'ru', 'sw', 'ta', 'th', 'tr', 'uk', 'vi', 'zh'
];

const root = path.resolve(__dirname, '..');
const enPath = path.join(root, 'src', 'i18n', 'locales', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const outDir = path.join(root, 'src', 'i18n', 'locales');

LOCALES.forEach((code) => {
  const outPath = path.join(outDir, `${code}.json`);
  fs.writeFileSync(outPath, JSON.stringify(en, null, 2), 'utf8');
  console.log('Wrote', outPath);
});
console.log('Done. 22 locale files created.');
