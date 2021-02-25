import { Player } from '@prisma/client';
import playerModel from '../modules/players/players.model';

const checkIfPlayerNameExists = async (
  name: string,
  userId: number,
): Promise<Player | null> => {
  const player = await playerModel.getPlayerByName(userId, name);
  return player;
};

export default checkIfPlayerNameExists;
