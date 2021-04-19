import { Router } from 'express';
import { updateGameScore } from './game.controller';

const gameRouter = Router();

gameRouter.route('/:id').put(updateGameScore);

export default gameRouter;
