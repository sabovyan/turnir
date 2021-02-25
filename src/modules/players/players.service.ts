import { Player } from '@prisma/client';
import { CreatePlayerProps } from './player.type';
import playerModel, { IPlayerModel } from './players.model';
import BadRequestError from '../../errors/BadRequestError';
import { validateCreatePlayerFields } from './validateCreatePlayerFields';

interface IPlayerService {
  getPlayers: (userId: number) => Promise<Player[]>;
  createPlayer: (data: CreatePlayerProps) => Promise<Player>;
}

class PlayersService implements IPlayerService {
  model: IPlayerModel;

  constructor() {
    this.model = playerModel;
  }

  getPlayers(userId: number): Promise<Player[]> {
    if (Number.isNaN(userId)) throw new BadRequestError('id is not a number');

    return this.model.getAllPlayers(userId);
  }

  async createPlayer(data: CreatePlayerProps) {
    await validateCreatePlayerFields(data);

    const player = await this.model.createNewPlayer(data);
    return player;
  }
}

const playersService = new PlayersService();

export default playersService;
