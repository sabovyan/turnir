import UserModel from '../modules/user/user.model';

const checkUserExitsById = async (id: number): Promise<boolean> => {
  const user = await UserModel.getUserById(id);
  return !!user;
};

export default checkUserExitsById;
