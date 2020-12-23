import * as dotenv from 'dotenv';
import App from './app';
import { PORT, DELETE_USERS } from './config/envConstants';
import prisma from './config/prismaClient';

dotenv.config();

if (!PORT) {
  process.exit(1);
}
(async () => {
  if (DELETE_USERS === 'true') {
    await prisma.user.deleteMany();
  }
})();

/* Server Activation */
const app = new App(PORT);

const server = app.start();

/* Webpack HMR Activation */
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
