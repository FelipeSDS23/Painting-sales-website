const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Admin = db.define('Admin', {
    email: {
        type: DataTypes.STRING,
        require: true
    },
    password: {
        type: DataTypes.STRING,
        require: true
    }
})

module.exports = Admin