import BadRequestError from '../../errors/BadRequestError';
import checkIfPlayerNameExists from '../../utils/checkIfPlayerNameExists';
import checkIsEmptyString from '../../utils/checkIsEmplyString';
import checkUserExitsById from '../../utils/checkUserExitsById';
import { CreatePlayerProps } from './player.type';

const validateCreatePlayerFields = async (
  data: CreatePlayerProps,
): Promise<void> => {
  const isEmptyName = checkIsEmptyString(data.name);

  if (isEmptyName) {
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
    throw new BadRequestError('The player already exists');
  }
};

export default validateCreatePlayerFields;
