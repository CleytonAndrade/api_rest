import { Sequelize } from 'sequelize';
import databaseConfig from '#src/config/database.cjs';
import Aluno from '#src/models/Aluno.js';
import User from '#src/models/User.js';
import Foto from '#src/models/Foto.js';
const models = [Aluno, User, Foto];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach(
  (model) => model.associate && model.associate(connection.models),
);
