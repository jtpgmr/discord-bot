const { commandTypes } = require('../utils/enums');

const { DataTypes } = require('sequelize');
const { db } = require('../clients')

const Command = db.define(
    'Command',
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: commandTypes.CHAT_INPUT,
        },
        nsfw: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        required: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        callbackSource: {
            type: DataTypes.STRING
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
        tableName: 'commands',
        timestamps: false
    },
);

module.exports = Command