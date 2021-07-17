import { PrismaClient } from '@prisma/client';
import seedPlayers from './seed/seedPlayers';
import seedTournamentTypes from './seed/seedTournamentTypes';

const prisma = new PrismaClient();

async function main(withPlayers?: boolean) {
  await seedTournamentTypes(prisma);
  if (withPlayers) {
    await seedPlayers(prisma);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
