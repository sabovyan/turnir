import express, { Router } from 'express';

const router = Router();

const registerRoute = router.route('/register');

registerRoute.get((req: express.Request, res: express.Response) => {
  res.status(200).send('first Route');
});

export default router;
