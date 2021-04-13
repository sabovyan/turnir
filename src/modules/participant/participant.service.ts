import { Participant } from '@prisma/client';
import { FunctionTypeWithPromiseResult, OnlyId } from '../../types/main';
import participantModel, { IParticipantModel } from './participant.model';

export interface IParticipantService {
  deleteMany: FunctionTypeWithPromiseResult<OnlyId[], Participant[]>;
}

class ParticipantService implements IParticipantService {
  private participantModel: IParticipantModel;

  constructor() {
    this.participantModel = participantModel;
  }

  deleteMany(data: OnlyId[]) {
    const participants = data.map(async (d) => {
      const participant = await this.participantModel.deleteById(d);

      return participant;
    }, []);

    return Promise.all(participants);
  }
}

const participantService = new ParticipantService();

export default participantService;
