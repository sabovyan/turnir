import { PrismaClient } from '@prisma/client';
import seedPlayers from './seed/seedPlayers';
import seedTournamentTypes from './seed/seedTournamentTypes';

const prisma = new PrismaClient();

async function main() {
  await seedTournamentTypes(prisma);
  // await seedPlayers(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
