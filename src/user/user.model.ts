/* eslint-disable class-methods-use-this */
import { User } from '@prisma/client';
import prisma from '../config/prismaClient';
import { UserData } from './user.types';

class UserModel {
  static async getUserByEmail(email: string): Promise<User | null> {
    const response = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return response;
  }

  static async createUser(data: UserData): Promise<User> {
    const response = await prisma.user.create({
      data,
    });
    return response;
  }

  static async updateUser(email: string): Promise<User> {
    const response = await prisma.user.update({
      where: { email },
      data: {
        verified: true,
      },
    });
    return response;
  }
}

export default UserModel;
