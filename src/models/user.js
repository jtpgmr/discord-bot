const { DataTypes } = require('sequelize');
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
            type: DataTypes.STRING,
            allowNull: false,
        },
        isBot: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        },
        createdBy: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: {
                model: "User",
                key: "id"
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
        updatedBy: {
            type: DataTypes.UUIDV4,
            references: {
                model: "User",
                key: "id"
            }
        },
    },
    {
        schema: 'discordBot',
        tableName: 'users',
        timestamps: false
    },
);

module.exports = User