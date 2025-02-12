const { constants: { commandTypes } } = require('../utils');
const { DataTypes, ValidationError } = require('sequelize');
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
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        callbackSource: { type: DataTypes.STRING },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        },
        createdBy: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: "User", key: "id" }
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.UUIDV4,
            allowNull: true,
            references: { model: "User", key: "id" }

        },
    },
    {
        schema: 'discordBot',
        tableName: 'commands',
        timestamps: false
    },
);


const SubGroupCommand = db.define(
    'SubGroupCommand',
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
        commandId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: "Command", key: "id" }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: { type: DataTypes.STRING },
        disabled: {
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
            references: { model: "User", key: "id" }

        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.UUIDV4,
            allowNull: true,
            references: { model: "User", key: "id" }
        },
    },
    {
        schema: 'discordBot',
        tableName: 'subGroupCommands',
        timestamps: false,
        indexes: [{  unique: true, fields: ['commandId', 'name'] }]
    },
);


const CommandOption = db.define(
    'CommandOption',
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
        commandId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: "Command", key: "id" }
        },
        subGroupCommandId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: "SubGroupCommand", key: "id" }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: { type: DataTypes.STRING },
        type: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            validate: {
                isNotSubGroupCommand(val) {
                    if (val == 2) throw new ValidationError('"type" value of "2" received. Please refer to creating a sub group command.')
                }
            }
        },
        required: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        disabled: {
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
            references: { model: "User", key: "id" }
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.UUIDV4,
            allowNull: true,
            references: { model: "User", key: "id" }
        },
    },
    {
        schema: 'discordBot',
        tableName: 'commandOptions',
        timestamps: false,
        indexes: [{  
            unique: true, 
            fields: ['commandId', 'subGroupCommandId', 'name'] 
        }]
    },
);

module.exports = { Command, SubGroupCommand,  CommandOption }