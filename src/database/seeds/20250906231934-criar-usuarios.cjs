// npx sequelize-cli db:seed:all
const bcryptjs = require('bcryptjs');
const gerador = require('password-generator');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const quantidadeUsuarios = 10; // Defina a quantidade de usuários que deseja criar

    function gerarnome(tamanho) {
      const letras = gerador(50);
      const letrasMaiusculas = letras.toUpperCase();

      // Primeiro caractere maiúsculo
      let resultado = letrasMaiusculas.charAt(
        Math.floor(Math.random() * letrasMaiusculas.length),
      );

      // Restante da string em minúsculas
      for (let i = 1; i < tamanho; i++) {
        resultado += letras.charAt(Math.floor(Math.random() * letras.length));
      }
      return resultado;
    }

    const usuarios = await Promise.all(
      Array.from({ length: quantidadeUsuarios }, async () => {
        // const senha = gerador(8);
        const email = gerarnome(4) + '@' + gerarnome(4) + '.com';
        const nome = gerarnome(6) + ' ' + gerarnome(3);

        return {
          nome: nome,
          email: email,
          password_hash: await bcryptjs.hash('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        };
      }),
    );

    await queryInterface.bulkInsert('users', usuarios, {});
  },

  async down() {},
};
