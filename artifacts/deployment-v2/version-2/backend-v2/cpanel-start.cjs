process.env.COLLINS_ENV ||= 'production';
process.env.NODE_ENV ||= 'production';

import('./src/server.js').catch((error) => {
  console.error(error);
  process.exit(1);
});
