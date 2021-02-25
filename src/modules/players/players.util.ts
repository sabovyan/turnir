import BadRequestError from '../../errors/BadRequestError';
import checkIfPlayerNameExists from '../../utils/checkIfPlayerNameExists';
import checkIsEmptyString from '../../utils/checkIsEmplyString';
import checkUserExitsById from '../../utils/checkUserExitsById';
import { UpdatePlayerRequest } from './player.type';

const validateUpdatePlayerNameFields = async ({
  id,
  userId,
  name,
}: UpdatePlayerRequest & { userId: number }): Promise<void> => {
  if (Number.isNaN(id)) throw new BadRequestError('id is not a number');

  if (Number.isNaN(userId)) throw new BadRequestError('userId is not a number');

  if (checkIsEmptyString(name)) throw new BadRequestError('name is empty');

  const isUserExists = await checkUserExitsById(userId);
  if (!isUserExists) throw new BadRequestError("user doesn't exist");

  const existingPlayer = await checkIfPlayerNameExists(name, userId);
  if (existingPlayer && existingPlayer.id !== id)
    throw new BadRequestError('player already exists');
};

export default validateUpdatePlayerNameFields;
