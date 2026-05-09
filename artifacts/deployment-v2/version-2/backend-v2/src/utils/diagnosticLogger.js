import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const diagnosticsLogPath = path.join(projectRoot, 'tmp', 'backend-diagnostics.log');

export const writeDiagnosticLog = (event, details = {}) => {
  const record = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  };

  try {
    mkdirSync(path.dirname(diagnosticsLogPath), { recursive: true });
    appendFileSync(diagnosticsLogPath, `${JSON.stringify(record)}\n`, 'utf8');
  } catch (error) {
    console.error('Unable to write diagnostic log', {
      event,
      message: error?.message,
    });
  }
};

