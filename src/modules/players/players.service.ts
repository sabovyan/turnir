import { Player } from '@prisma/client';
import {
  CreatePlayerProps,
  UpdatePlayerRequest,
  updatePlayerGroupRequest,
} from './player.type';
import playerModel, { IPlayerModel } from './players.model';
import BadRequestError from '../../errors/BadRequestError';
import validateCreatePlayerFields from './validateCreatePlayerFields';
import isStringNumeric from '../../utils/isStringNumeric';
import validateUpdatePlayerNameFields from './players.util';
import isNumber from '../../utils/IsNumber';

interface IPlayerService {
  getAllPlayers: (userId: number) => Promise<Player[]>;
  createPlayer: (data: CreatePlayerProps) => Promise<Player>;
  deletePlayerById: (id: string) => Promise<Player>;
  updatePlayerName: (
    data: UpdatePlayerRequest & { userId: number },
  ) => Promise<Player>;
  updatePlayerGroup: ({
    groupId,
    playerId,
  }: updatePlayerGroupRequest) => Promise<Player>;
}

class PlayersService implements IPlayerService {
  model: IPlayerModel;

  constructor() {
    this.model = playerModel;
  }

  getAllPlayers(userId: number): Promise<Player[]> {
    if (Number.isNaN(userId)) throw new BadRequestError('id is not a number');

    return this.model.getAllPlayers(userId);
  }

  async createPlayer(data: CreatePlayerProps) {
    await validateCreatePlayerFields(data);

    const player = await this.model.createNewPlayer(data);
    return player;
  }

  async deletePlayerById(id: string) {
    if (!isStringNumeric(id)) throw new BadRequestError('wrong credentials');

    const numericId = Number(id);

    const player = await this.model.deletePlayerById(numericId);
    return player;
  }

  async updatePlayerName({
    id,
    userId,
    name,
  }: UpdatePlayerRequest & { userId: number }) {
    await validateUpdatePlayerNameFields({ id, name, userId });

    const player = this.model.updatePlayerName({ id, name });

    return player;
  }

  async updatePlayerGroup(data: updatePlayerGroupRequest) {
    if (!isNumber(data.groupId)) throw new BadRequestError('wrong credentials');
    if (!isNumber(data.playerId))
      throw new BadRequestError('wrong credentials');

    const player = await this.model.updatePlayerGroup(data);

    return player;
  }
}

const playersService = new PlayersService();

export default playersService;
