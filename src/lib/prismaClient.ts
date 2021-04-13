import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['warn', 'error'],
  errorFormat: 'pretty',
});
export default prisma;
