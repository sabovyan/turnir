import { GameInstance, OnlyId } from '../types';

const getParticipantIdsFromGames = (games: GameInstance[]): OnlyId[] => {
  const ParticipantSet = games.reduce<Set<number>>(
    (acc, { participant1Id, participant2Id }) => {
      if (participant1Id) {
        acc.add(participant1Id);
      }

      if (participant2Id) {
        acc.add(participant2Id);
      }

      return acc;
    },
    new Set(),
  );

  const participants = Array.from(ParticipantSet).map((el) => ({ id: el }));

  return participants;
};

export default getParticipantIdsFromGames;
