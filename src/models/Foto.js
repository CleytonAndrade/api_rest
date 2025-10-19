import Sequelize, { Model } from 'sequelize';
import appConfig from '#src/config/appConfig.js';
export default class Foto extends Model {
  static init(sequelize) {
    super.init(
      {
        originalname: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Campo não pode ficar vazio.',
            },
          },
          allowNull: false,
        },
        filename: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Campo não pode ficar vazio.',
            },
          },
          allowNull: false,
        },
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${appConfig.url}/images/${this.getDataValue('filename')}`;
          },
        },
      },

      {
        sequelize,
        tableName: 'fotos',
      },
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Aluno, { foreignKey: 'aluno_id' });
  }
}
