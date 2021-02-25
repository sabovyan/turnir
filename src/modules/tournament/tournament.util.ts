// eslint-disable-next-line max-classes-per-file
interface Player {
  name: string;
}

class Score {
  player: Player;
  point: number;
  constructor(player: any) {
    this.point = 0;
    this.player = player;
  }
}

class Game {
  score: Score[];
  constructor(players: Player[]) {
    this.score = players.map((pl: Player) => new Score(pl));
  }
}

export const getNumberOfGames = (players: Player[]): Game[] => {
  let totalGames = 0;
  let count = 0;
  const games = [];
  const playersCopy = [...players];

  const firstRoundGamesNumber =
    2 ** Math.ceil(Math.log(players.length) / Math.log(2) - 1);

  while (playersCopy.length && count <= firstRoundGamesNumber) {
    const game = new Game([playersCopy[playersCopy.length - 1]]);
    games.push(game);
    playersCopy.pop();
    count += 1;
    if (count === firstRoundGamesNumber) {
      count = 0;
    }
  }

  for (let i = firstRoundGamesNumber; i >= 1; i /= 2) {
    totalGames += i;
  }

  return games;
};

const players: Player[] = [
  { name: 'Avet' },
  { name: 'Gayane' },
  { name: 'Sargis' },
];

console.log(getNumberOfGames(players));
