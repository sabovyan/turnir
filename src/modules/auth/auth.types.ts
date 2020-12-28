import { User } from '@prisma/client';
import { MailDataRequired } from '@sendgrid/mail';

export type UserData = {
  displayName: string;
  email: string;
  password: string;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  verified?: boolean;
};

export type setMessageFunctionType = (
  to: string,
  displayName: string,
  link: string,
) => MailDataRequired;
