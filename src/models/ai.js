const { DataTypes } = require('sequelize');
const { db } = require('../clients')

const RegisteredAIModel = db.define(
    'RegisteredAIModel',
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
        category: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        subCategory: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        modelName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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
        tableName: 'registeredAIModels',
        timestamps: false,
        indexes: [{  
            unique: true, 
            fields: ['provider', 'modelName'] 
        }]
    },
);

module.exports = { RegisteredAIModel }