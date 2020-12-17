import * as dotenv from 'dotenv';
import PORT from './config/constants';
import createApp from './app';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

/* Server Activation */
const app = createApp();

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀Listening on port ${PORT}`);
});

/* Webpack HMR Activation */
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
