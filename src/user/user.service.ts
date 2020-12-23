import prisma from '../config/prismaClient';
import RegistrationError from '../errors/registrationError';
import { UserData, createUserType } from './user.types';
import sgMail, { setMessage } from '../config/sendGrid';
import { setCryptoPassword } from './user.utils';

export const sendMail = async (
  to: string,
  displayName: string,
  token: string,
): Promise<void> => {
  await sgMail.send(setMessage(to, displayName, token));
};

export const createUser: createUserType = async (data: UserData) => {
  const hasUserWithEmail = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (hasUserWithEmail) {
    throw new RegistrationError('This email is already in use!');
  }

  const dataWithCryptoPassword: UserData = {
    ...data,
    password: setCryptoPassword(data.password),
  };

  const response = await prisma.user.create({ data: dataWithCryptoPassword });
  return response;
};
