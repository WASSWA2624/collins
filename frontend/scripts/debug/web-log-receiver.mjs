import http from 'node:http';

const DEFAULT_PORT = 8787;
const MAX_BODY_BYTES = 64 * 1024;
const port = Number.parseInt(process.env.COLLINS_WEB_LOG_PORT || String(DEFAULT_PORT), 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('[collins-debug] COLLINS_WEB_LOG_PORT must be an integer between 1 and 65535.');
  process.exit(1);
}

const send = (res, status, body = '') => {
  res.writeHead(status, {
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-origin': '*',
    'content-type': 'application/json',
  });
  res.end(body);
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0;
    let body = '';

    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Log payload is too large.'));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Log payload must be valid JSON.'));
      }
    });
    req.on('error', reject);
  });

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    send(res, 204);
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    send(res, 200, JSON.stringify({ ok: true, service: 'collins-web-log-receiver' }));
    return;
  }

  if (req.method !== 'POST' || req.url !== '/logs') {
    send(res, 404, JSON.stringify({ error: 'Not found' }));
    return;
  }

  try {
    const log = await readJsonBody(req);
    const level = typeof log.level === 'string' ? log.level : 'info';
    const message = typeof log.message === 'string' ? log.message : JSON.stringify(log);
    const timestamp = log.timestamp || new Date().toISOString();
    console.log(`[web:${level}] ${timestamp} ${message}`);
    send(res, 204);
  } catch (error) {
    send(res, 400, JSON.stringify({ error: error.message }));
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`[collins-debug] Web log receiver listening on http://127.0.0.1:${port}/logs`);
});

