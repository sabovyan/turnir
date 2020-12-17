/**
 * Required External Modules
 */

import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT);

const app = express();
console.log('here');

// /**
//  *  App Configuration
//  */

app.use(cors());
app.use(express.json());

// /**
//  * Server Activation
//  */

const server = app.listen(PORT, () => {
  console.log(`🚀Listening on port ${PORT}`);
});

// /**
//  * Webpack HMR Activation
//  */
// if (module.hot) {
//   module.hot.accept();
//   module.hot.dispose(() => server.close());
// }
