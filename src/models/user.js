const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../clients')

const User = db.define(
    'User',
    {
        serialId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            unique: true,
        },
        id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            unique: true
        },
        discordId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        discordUsername: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        globalName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isBot: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        },
        createdBy: {
            type: DataTypes.UUIDV4,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        schema: 'discordBot',
        tableName: 'users'
    },
);

module.exports = User