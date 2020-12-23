import { User } from '@prisma/client';

export type UserData = {
  email: string;
  password: string;
  userName: string;
};

export type createUserType = (data: UserData) => Promise<User>;
