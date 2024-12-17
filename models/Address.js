const { DataTypes } = require('sequelize');

const db = require('../db/conn')

const User = require('./User');

const Address = db.define('Address', {
    street: {
        type: DataTypes.STRING,
        require: true
    },
    number: {
        type: DataTypes.STRING,
        require: true
    },
    complement: {
        type: DataTypes.STRING,
        require: true
    },
    neighborhood: {
        type: DataTypes.STRING,
        require: true
    },
    city: {
        type: DataTypes.STRING,
        require: true
    },
    state: {
        type: DataTypes.STRING,
        require: true
    },
    zipCode: {
        type: DataTypes.STRING,
        require: true
    }
});

Address.belongsTo(User)
User.hasMany(Address)

module.exports = Address;