/* eslint-disable class-methods-use-this */
import { User } from '@prisma/client';
import prisma from '../../config/prismaClient';
import { UserData } from '../auth/auth.types';

class UserModel {
  static async getUserById(id: number): Promise<User | null> {
    const response = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return response;
  }

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

  static async updateUserById(id: number, data: any): Promise<User> {
    const response = await prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
    return response;
  }
}

export default UserModel;
