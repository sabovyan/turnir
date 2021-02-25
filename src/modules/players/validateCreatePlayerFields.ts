import BadRequestError from '../../errors/BadRequestError';
import checkIfPlayerNameExists from '../../utils/checkIfPlayerNameExists';
import checkUserExitsById from '../../utils/checkUserExitsById';
import { CreatePlayerProps } from './player.type';

export const validateCreatePlayerFields = async (data: CreatePlayerProps) => {
  if (data.name.trim() === '') {
    throw new BadRequestError('name is required');
  }

  if (typeof data.userId !== 'number') {
    throw new BadRequestError('id is not a number');
  }

  const userExists = await checkUserExitsById(data.userId);
  if (!userExists) {
    throw new BadRequestError('Your user credentials are not correct');
  }

  const nameExistsWithCurrentUser = await checkIfPlayerNameExists(
    data.name,
    data.userId,
  );

  if (nameExistsWithCurrentUser) {
    throw new BadRequestError('Player with this name already exists');
  }
};
