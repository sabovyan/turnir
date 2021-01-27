import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';

export const getTournaments = asyncWrapper((req: Request, res: Response) => {
  res.send('here');
});
