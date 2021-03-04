import { NextFunction, Request, Response } from 'express';
import prisma from '../lib/prismaClient';

const asyncWrapper = (
  asyncCallback: (req: Request, res: Response) => void,
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await asyncCallback(req, res);

    next();
  } catch (err) {
    next(err);
    console.log('\x1b[31m%s\x1b[0m', err.message);
  } finally {
    prisma.$disconnect();
  }
};

export default asyncWrapper;
