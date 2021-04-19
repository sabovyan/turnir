import { Response } from 'express';
import asyncWrapper from '../../middleware/AsyncWrapper';
import { IRequest } from '../../types';
import gameService from './game.service';

type updateScoreData = {
  firstParticipantScore: number[];
  secondParticipantScore: number[];
};

export const updateGameScore = asyncWrapper(
  async (req: IRequest<updateScoreData>, res: Response) => {
    const { id } = req.params;
    const { firstParticipantScore, secondParticipantScore } = req.body;

    const gameId = Number(id);

    const game = await gameService.updateGameScore({
      gameId,
      firstParticipantScore,
      secondParticipantScore,
    });

    res.status(200).json(game);
  },
);
