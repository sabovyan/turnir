import { Player, PlayerGroup } from '@prisma/client';
import BadRequestError from '../../errors/BadRequestError';
import playerGroupModal from './playerGroups.modal';

interface IPlayerGroupService {
  getAllGroups: (userId: number) => Promise<PlayerGroup[]>;
  getGroupByGroupId: (
    group: number | string,
  ) => Promise<
    | (PlayerGroup & {
        players: Player[];
      })
    | null
  >;
  createNewGroup: (data: {
    userId: number;
    name: string;
  }) => Promise<PlayerGroup>;
}

class PlayerGroupService implements IPlayerGroupService {
  // eslint-disable-next-line class-methods-use-this
  async createNewGroup(data: { userId: number; name: string }) {
    const group = await playerGroupModal.createNewGroup(data);
    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  async getAllGroups(userId: number): Promise<PlayerGroup[]> {
    const groups = await playerGroupModal.getAllGroups(userId);
    return groups;
  }

  // eslint-disable-next-line class-methods-use-this
  async getGroupByGroupId(groupId: number | string) {
    if (Number.isNaN(groupId))
      throw new BadRequestError('your id must be be a number');

    const id = Number(groupId);

    const group = await playerGroupModal.getGroupByGroupId(id);
    return group;
  }
}

const playerGroupService = new PlayerGroupService();

export default playerGroupService;
