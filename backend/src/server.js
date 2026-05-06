import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

const app = createApp();

const server = app.listen(env.port, env.host, () => {
  const hostLabel = env.host === '0.0.0.0' || env.host === '::'
    ? 'all network interfaces'
    : env.host;
  console.log(`AI Vent backend listening on ${hostLabel}:${env.port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down AI Vent backend.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
