import { User } from '@prisma/client';
import { MailDataRequired } from '@sendgrid/mail';

export type UserData = {
  email: string;
  password: string;
  displayName: string;
};

export type createUserType = (data: UserData) => Promise<User>;

export type setMessageFunctionType = (
  to: string,
  displayName: string,
  link: string,
) => MailDataRequired;
