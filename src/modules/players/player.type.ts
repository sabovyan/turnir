export type CreatePlayerProps = {
  name: string;
  userId: number;
};

export type UpdatePlayerRequest = {
  id: number;
  name: string;
};

export type updatePlayerGroupRequest = {
  groupId: number;
  playerId: number;
};
