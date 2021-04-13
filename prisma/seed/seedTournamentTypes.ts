import { PrismaClient } from '@prisma/client';

async function seedTournamentTypes(prisma: PrismaClient): Promise<void> {
  await prisma.tournamentType.create({
    data: {
      name: 'Elimination',
    },
  });
  await prisma.tournamentType.create({
    data: {
      name: 'Last Man Standing',
    },
  });
  await prisma.tournamentType.create({
    data: {
      name: 'Round Robin',
    },
  });
}

export default seedTournamentTypes;
