import cors from 'cors';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { Server } from 'http';
import errorHandler from './middleware/ErrorHandler';
import authRouter from './modules/auth/auth.route';
import tournamentRouter from './modules/tournament/tournament.route';
import playersRouter from './modules/players/players.route';
import groupRouter from './modules/group/group.route';
import userRouter from './modules/user/user.route';
import gameRouter from './modules/game/game.route';

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
    this.app.use(cookieParser());
    this.app.use('/api/tournament', tournamentRouter);
    this.app.use('/api/auth', authRouter);
    this.app.use('/api/players', playersRouter);
    this.app.use('/api/group', groupRouter);
    this.app.use('/api/user', userRouter);
    this.app.use('/api/game', gameRouter);
    this.app.use(errorHandler);
  }

  start(): Server {
    this.setConfig();
    return this.app.listen(this.port, () =>
      // eslint-disable-next-line no-console
      console.log(
        '\x1b[43m\x1b[37m%s\x1b[0m',
        `🚀 listening port ${this.port}`,
      ),
    );
  }
}

export default App;
