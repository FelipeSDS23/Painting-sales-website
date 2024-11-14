const { Sequelize } = require('sequelize')

const DB_HOST = 'localhost'
const DB_USER = 'root'
const DB_PASSWORD = 'root'
const DB_NAME = 'painting_sales_website'

const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_HOST,
        dialect: 'mysql'
    }
)

try {
    sequelize.authenticate()
    console.log('Conexão com o banco de dados realizada com sucesso!')
} catch (error) {
    console.log(`Não foi possível conectar-se ao banco de dados: ${error}`)
}

module.exports = sequelize