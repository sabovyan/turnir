import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
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
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
