import dotenv from 'dotenv';
dotenv.config();
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';

import '#src/database/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
import homeRoutes from '#src/routes/homeRoutes.js';
import userRoutes from '#src/routes/userRoutes.js';
import tokenRoutes from '#src/routes/tokenRoutes.js';
import alunoRoutes from '#src/routes/alunoRoutes.js';
import fotoRoutes from '#src/routes/fotoRoutes.js';

const whiteList = process.env.WHITE_LIST.split(',');

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(helmet({ crossOriginResourcePolicy: false }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(
      '/images',
      express.static(resolve(__dirname, '..', 'uploads', 'images')),
    );
  }

  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/users/', userRoutes);
    this.app.use('/tokens/', tokenRoutes);
    this.app.use('/alunos/', alunoRoutes);
    this.app.use('/fotos/', fotoRoutes);
  }
}

export default new App().app;
