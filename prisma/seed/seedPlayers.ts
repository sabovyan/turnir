import { PrismaClient } from '@prisma/client';

const seedPlayers: (prisma: PrismaClient) => Promise<void> = async (
  prisma: PrismaClient,
) => {
  await prisma.user.update({
    where: {
      id: 2,
    },
    data: {
      player: {
        create: [
          {
            name: 'Lucy',
          },
          {
            name: 'Avet',
          },
          {
            name: 'Gurgen',
          },
          {
            name: 'Gayane',
          },
          {
            name: 'Arman',
          },
          {
            name: 'Harut',
          },
          {
            name: 'Gev',
          },
          {
            name: 'Anna',
          },
          {
            name: 'Arev',
          },
          {
            name: 'Ani',
          },
          {
            name: 'Tatevik',
          },
          {
            name: 'Romela',
          },
        ],
      },
    },
  });
};

export default seedPlayers;
