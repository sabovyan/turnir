import express from 'express';
import cors from 'cors';
import apiRoutes from './Routes/Routes';
import { AppFunction } from './types/main';

const createApp: AppFunction = () => {
  const app = express();

  /* App Configuration */
  app.use(cors());
  app.use(express.json());
  app.use('/api', apiRoutes);

  return app;
};

export default createApp;
