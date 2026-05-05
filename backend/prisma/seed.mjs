import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import {
  DEVELOPMENT_REFERENCE_SEED_EMAIL,
  DEVELOPMENT_REFERENCE_SEED_USER_ID,
  buildSeedReferenceRuleRows,
} from '../src/modules/references/referenceSeed.js';

const prisma = new PrismaClient();

const main = async () => {
  const passwordHash = await bcrypt.hash('disabled-development-reference-seed-user', 12);
  const seedUser = await prisma.user.upsert({
    where: { email: DEVELOPMENT_REFERENCE_SEED_EMAIL },
    update: {
      name: 'Development Reference Seed',
      status: 'DEACTIVATED',
    },
    create: {
      id: DEVELOPMENT_REFERENCE_SEED_USER_ID,
      name: 'Development Reference Seed',
      email: DEVELOPMENT_REFERENCE_SEED_EMAIL,
      passwordHash,
      status: 'DEACTIVATED',
    },
  });

  const rules = buildSeedReferenceRuleRows(undefined, { seedUserId: seedUser.id });
  for (const rule of rules) {
    await prisma.referenceRule.upsert({
      where: {
        name_version: {
          name: rule.name,
          version: rule.version,
        },
      },
      update: rule,
      create: rule,
    });
  }

  console.log(`Seeded ${rules.length} verified development reference rules.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
