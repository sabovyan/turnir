import playerModel from '../modules/players/players.model';

const checkIfPlayerNameExists = async (name: string, userId: number) => {
  const player = await playerModel.getPlayerByName(userId, name);
  return !!player;
};

export default checkIfPlayerNameExists;
