import App from './app';
import { PORT, DELETE_USERS, FRESH_START } from './config/envConstants';
import prisma from './lib/prismaClient';

(async () => {
  if (DELETE_USERS === 'true') {
    await prisma.user.deleteMany();
  }
})();

(async () => {
  if (FRESH_START === 'yes') {
    await prisma.user.deleteMany();
    await prisma.player.deleteMany();
    await prisma.game.deleteMany();
    await prisma.group.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.tournamentType.deleteMany();
  }
})();

const app = new App(PORT);

const server = app.start();

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
