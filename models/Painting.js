const { DataTypes } = require('sequelize');

const db = require('../db/conn');

const Admin = require('./Admin');

const Painting = db.define('Painting', {
    name: {
        type: DataTypes.STRING,
        require: true
    },
    description: {
        type: DataTypes.TEXT,
        require: true
    },
    height: {
        type: DataTypes.STRING,
        require: true
    },
    width: {
        type: DataTypes.STRING,
        require: true
    },
    frameType: {
        type: DataTypes.STRING,
        require: true
    },
    price: {
        type: DataTypes.STRING,
        require: true
    }
});

Painting.belongsTo(Admin);
Admin.hasMany(Painting);

module.exports = Painting;