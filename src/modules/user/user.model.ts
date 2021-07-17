/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Player, Group, User } from '@prisma/client';
import prisma from '../../lib/prismaClient';
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
      data: {
        ...data,
      },
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
  static async updateUserVerificationTokenByEmail(
    email: string,
    token: string,
  ): Promise<User> {
    const response = await prisma.user.update({
      where: { email },
      data: {
        verificationToken: token,
      },
    });
    return response;
  }

  static async getAllPlayersAndGroupsByUserId(
    userId: number,
  ): Promise<{
    groups: Group[];
    players: Player[];
  } | null> {
    const response = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        groups: {
          include: {
            players: {
              orderBy: {
                name: 'asc',
              },
            },
          },
        },
        players: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    return response;
  }
}

export default UserModel;
