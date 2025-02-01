const { commandOptionTypes } = require('../utils/enums');
const { DataTypes } = require('sequelize');
const { db } = require('../clients')

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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.SMALLINT,
            allowNull: false,
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
        tableName: 'commandOptions',
        timestamps: false
    },
);

module.exports = CommandOption