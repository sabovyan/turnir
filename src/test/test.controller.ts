import { Request, Response } from 'express';
import asyncWrapper from '../middleware/AsyncWrapper';

const testRoute = asyncWrapper((_req: Request, res: Response): void => {
  res.send('here');
});

export const testRouteWithToken = asyncWrapper(
  (req: Request, res: Response): void => {
    res.json('here');
  },
);

export default testRoute;
