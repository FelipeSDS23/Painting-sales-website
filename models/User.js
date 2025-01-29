const { DataTypes } = require('sequelize');

const db = require('../db/conn');

const User = db.define('User', {
    email: {
        type: DataTypes.STRING,
        require: true
    },
    password: {
        type: DataTypes.STRING,
        require: true
    },
    fullName: {
        type: DataTypes.STRING,
        require: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        require: true
    }
});

module.exports = User;