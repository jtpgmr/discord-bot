const { constants: { commandTypes } } = require('../utils');
const { DataTypes, ValidationError } = require('sequelize');
const { db } = require('../config')

const SubCommand = db.define(
    'SubCommand',
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
            allowNull: false
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
        serverId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: "Server", key: "id" }
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
        schema: 'chatBot',
        tableName: 'subCommands',
        timestamps: false,
        indexes: [{  unique: true, fields: ['serverId', 'name'] }]
    },
);


const SubCommandGroup = db.define(
    'SubCommandGroup',
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
        subCommandId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: "SubCommand", key: "id" }
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
        schema: 'chatBot',
        tableName: 'subCommandGroups',
        timestamps: false,
        indexes: [{  unique: true, fields: ['subCommandId', 'name'] }]
    },
);


const SubCommandOption = db.define(
    'SubCommandOption',
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
        subCommandId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: "SubCommand", key: "id" }
        },
        subCommandGroupId: {
            type: DataTypes.UUIDV4,
            references: { model: "SubCommandGroup", key: "id" }
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
                isNotSubCommandGroup(val) {
                    if (val === 2) throw new ValidationError('"type" value of "2" received. Please refer to creating a sub group command.')
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
        choices: {
            type: DataTypes.JSONB
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
        schema: 'chatBot',
        tableName: 'subCommandOptions',
        timestamps: false,
        indexes: [{  
            unique: true, 
            fields: ['subCommandId', 'subCommandGroupId', 'name'] 
        }]
    },
);

module.exports = { SubCommand, SubCommandGroup,  SubCommandOption }