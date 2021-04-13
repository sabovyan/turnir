import { Group, Player } from '@prisma/client';
import BadRequestError from '../../errors/BadRequestError';

import isStringNumeric from '../../utils/isStringNumeric';
import UserModel from './user.model';

interface IUserInterface {
  getAllGroupsAndPlayers: (
    id: string,
  ) => Promise<{
    groups: Group[];
    players: Player[];
  } | null>;
}

class UserService implements IUserInterface {
  // eslint-disable-next-line class-methods-use-this
  async getAllGroupsAndPlayers(id: string) {
    if (!isStringNumeric(id)) throw new BadRequestError('wrong credentials');

    const GroupsAndPlayers = await UserModel.getAllPlayersAndGroupsByUserId(
      Number(id),
    );

    return GroupsAndPlayers;
  }
}

const userService = new UserService();

export default userService;
