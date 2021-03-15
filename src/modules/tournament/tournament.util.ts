// import { Player } from '.prisma/client';

// eslint-disable-next-line max-classes-per-file
interface Player {
  name: string;
}

// class Score {
//   player: Player;
//   point: number;
//   constructor(player: any) {
//     this.point = 0;
//     this.player = player;
//   }
// }

// class Game {
//   score: Score[];
//   constructor(players: Player[]) {
//     this.score = players.map((pl: Player) => new Score(pl));
//   }
// }

export const getNumberOfGames = (players: Omit<Player, 'id'>[]) => {
  const totalNumberOfGames = players.length - 1;

  // let totalGames = 0;
  // let count = 0;
  // const playersCopy = [...players];
  // const firstRoundGamesNumber =
  //   2 ** Math.ceil(Math.log(players.length) / Math.log(2) - 1);
};

const players: Player[] = [
  { name: 'Avet' },
  { name: 'Gayane' },
  { name: 'Sargis' },
];
