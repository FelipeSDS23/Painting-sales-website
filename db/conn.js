const { Sequelize } = require('sequelize');

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_HOST,
        dialect: 'mysql'
    }
);

try {
    sequelize.authenticate();
    console.log('Conexão com o banco de dados realizada com sucesso!');
} catch (error) {
    console.log(`Não foi possível conectar-se ao banco de dados: ${error}`);
}

module.exports = sequelize;