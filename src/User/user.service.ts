import prisma from '../config/prismaClient';
import RegistrationError from '../errors/registrationError';
import { UserData, createUserType } from './user.types';
import sgMail, { setMessage } from '../config/sendGrid';

export const sendMail = async (
  to: string,
  userName: string,
  link: string,
): Promise<void> => {
  await sgMail.send(setMessage(to, userName, link));
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

  const response = await prisma.user.create({ data });
  return response;
};
