import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { Server } from 'http';
import errorHandler from './middleware/ErrorHandler';
import userRouter from './user/user.route';

class App {
  app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  getConfig(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use('/api', userRouter);
    this.app.use(errorHandler);
  }

  testRoute(): void {
    this.app.post('/api', async (req: Request, res: Response) => {
      res.status(200).send('here');
    });
  }

  start(): Server {
    this.testRoute();
    this.getConfig();
    return this.app.listen(this.port, () =>
      // eslint-disable-next-line no-console
      console.log(`🚀 listening port ${this.port}`),
    );
  }
}

export default App;
