import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'http';
import errorHandler from './middleware/ErrorHandler';
import authRouter from './modules/auth/auth.route';

class App {
  app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  setConfig(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use('/api/auth', authRouter);
    this.app.use(errorHandler);
  }

  start(): Server {
    this.setConfig();
    return this.app.listen(this.port, () =>
      // eslint-disable-next-line no-console
      console.log(`🚀 listening port ${this.port}`),
    );
  }
}

export default App;
