import BadRequestError from '../../errors/BadRequestError';
import checkIsEmptyString from '../../utils/checkIsEmplyString';
import checkUserExitsById from '../../utils/checkUserExitsById';
import isNumber from '../../utils/IsNumber';
import {
  DisconnectPlayersRequest,
  UpdateManyPlayersOfGroupRequest,
} from './group.type';
import playerGroupModel from './playerGroups.modal';

export const validateGroupNameUpdateFields = async (
  groupId: unknown,
  userId: number,
  name: string,
): Promise<void> => {
  if (!isNumber(groupId)) throw new BadRequestError('id is not a number');

  if (!isNumber(userId)) throw new BadRequestError('userId is not a number');

  if (checkIsEmptyString(name)) throw new BadRequestError('name is empty');

  const isUserExists = await checkUserExitsById(userId);
  if (!isUserExists) throw new BadRequestError("user doesn't exist");
};

export const validateFieldsForDisconnect = async ({
  groupId,
  playerId,
}: DisconnectPlayersRequest): Promise<void> => {
  if (!isNumber(groupId)) throw new BadRequestError('wrong credentials');
  if (!isNumber(playerId)) throw new BadRequestError('wrong credentials');

  const foundGroup = await playerGroupModel.getGroupByGroupId(groupId);

  if (!foundGroup) throw new BadRequestError("group doesn't exist");

  const foundPlayer = foundGroup.players.find(
    (player) => player.id === playerId,
  );

  if (!foundPlayer)
    throw new BadRequestError('Player is not part of the group');
};

export const validateAddMultiplePlayers = async ({
  groupId,
  playerIds,
}: UpdateManyPlayersOfGroupRequest): Promise<void> => {
  if (!isNumber(groupId)) throw new BadRequestError('wrong credentials');

  if (playerIds.some((player) => !isNumber(player.id))) {
    throw new BadRequestError('wrong credentials');
  }

  const currentGroup = await playerGroupModel.getGroupByGroupId(groupId);

  if (!currentGroup) throw new BadRequestError("group doesn't exit");
};
