import { NextFunction, Request, Response } from 'express';
import prisma from '../config/prismaClient';

const asyncWrapper = (
  asyncCallback: (req: Request, res: Response) => Promise<void>,
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await asyncCallback(req, res);

    next();
  } catch (err) {
    next(err);
  } finally {
    prisma.$disconnect();
  }
};

export default asyncWrapper;
