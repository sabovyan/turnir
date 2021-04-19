import { Participant, Prisma } from '.prisma/client';
import prisma from '../../lib/prismaClient';
import { FunctionTypeWithPromiseResult, OnlyId } from '../../types';

export interface IParticipantModel {
  deleteById: FunctionTypeWithPromiseResult<OnlyId, Participant>;
}

class ParticipantModel implements IParticipantModel {
  instance: Prisma.ParticipantDelegate<false>;

  constructor() {
    this.instance = prisma.participant;
  }

  async deleteById({ id }: OnlyId) {
    const participant = await this.instance.delete({
      where: {
        id,
      },
    });

    return participant;
  }
}

const participantModel = new ParticipantModel();

export default participantModel;
