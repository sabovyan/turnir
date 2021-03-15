export type UpdateGroupNameRequest = {
  groupId: number;
  userId: number;
  name: string;
};

export type PlayerId = {
  id: number;
};

export type UpdateManyPlayersOfGroupRequest = {
  groupId: number;
  playerIds: PlayerId[];
};

export type updateOnePlayersConnectionToAGroupRequest = {
  groupId: number;
  playerId: number;
};

export type DisconnectPlayersRequest = {
  groupId: number;
  playerId: number;
};
