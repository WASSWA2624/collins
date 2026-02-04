/**
 * Dev-only HTTP server: receives browser console logs and writes to debug/web-debug.log.
 * Overwrites the log file when the server starts. Run: npm run debug:web
 */
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.DEBUG_LOG_PORT) || 9966;
const projectRoot = path.resolve(__dirname, '..', '..');
const logDir = path.join(projectRoot, 'debug');
const logPath = path.join(logDir, 'web-debug.log');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logStream = fs.createWriteStream(logPath, { flags: 'w' });

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const ts = new Date().toISOString();
        const level = payload.level || 'log';
        logStream.write(`[${ts}] [${level.toUpperCase()}] ${payload.message}\n`);
        res.writeHead(204);
        res.end();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad request');
      }
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Web log receiver: http://127.0.0.1:${PORT}/log → ${logPath}`);
});
