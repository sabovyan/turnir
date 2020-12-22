import * as dotenv from 'dotenv';
import App from './app';
import PORT from './config/constants';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

/* Server Activation */
const app = new App(PORT);

const server = app.start();

/* Webpack HMR Activation */
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
