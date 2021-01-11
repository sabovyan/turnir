import App from './app';
import { PORT, DELETE_USERS } from './config/envConstants';
import prisma from './lib/prismaClient';

(async () => {
  if (DELETE_USERS === 'true') {
    await prisma.user.deleteMany();
  }
})();

const app = new App(PORT);

const server = app.start();

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
