import { OnlyId } from '../../types/main';

export type UpdateGroupNameRequest = {
  groupId: number;
  userId: number;
  name: string;
};

export type UpdateManyPlayersOfGroupRequest = {
  groupId: number;
  playerIds: OnlyId[];
};

export type updateOnePlayersConnectionToAGroupRequest = {
  groupId: number;
  playerId: number;
};

export type DisconnectPlayersRequest = {
  groupId: number;
  playerId: number;
};
