const { DataTypes } = require('sequelize');
const { db } = require('../clients')

const Guild = db.define(
    'Guild',
    {
        serialId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
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
            primaryKey: true,
            autoIncrementIdentity: true,
            unique: true,
        },
        ownerId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            references: {
                model: "User",
                key: "id"
            }
        },
        name: {
            type: DataTypes.UUIDV4,
            allowNull: false,
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
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.UUIDV4,
            allowNull: true,
            references: {
                model: "User",
                key: "id"
            }
        },
    },
    {
        schema: 'discordBot',
        tableName: 'guilds'
    },
);


module.exports = Guild