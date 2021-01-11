import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['warn'],
  errorFormat: 'pretty',
});
export default prisma;
