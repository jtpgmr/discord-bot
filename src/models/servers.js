const { DataTypes } = require('sequelize');
const { db } = require('../config')

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
        isBot: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        platformId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        platform: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1
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
        },
        updatedBy: {
            type: DataTypes.UUIDV4,
            references: { model: "User", key: "id" }
        },
    },
    {
        schema: 'chatBot',
        tableName: 'users',
        timestamps: false
    },
);

const UserSummary = db.define(
    'UserSummary',
    {
        serialId: { type: DataTypes.INTEGER, primaryKey: true },
        id: { type: DataTypes.UUIDV4 },
        isBot: { type: DataTypes.BOOLEAN },
        platformId: { type: DataTypes.STRING },
        platform: { type: DataTypes.SMALLINT },
        servers: { type: DataTypes.JSONB },
        createdAt: { type: DataTypes.DATE },
        createdBy: { type: DataTypes.UUIDV4 },
        updatedAt: { type: DataTypes.DATE },
        updatedBy: { type: DataTypes.UUIDV4 },
    },
    {
        schema: 'chatBot',
        tableName: 'userSummary',
        timestamps: false,
        primaryKey: false
    },
);

const Server = db.define(
    'Server',
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
        platformId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        platform: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1
        },
        ownerId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: User, key: "id" }
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
            references: { model: User, key: "id" }
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.UUIDV4,
            allowNull: true,
            references: { model: User, key: "id" }
        },
    },
    {
        schema: 'chatBot',
        tableName: 'servers',
        timestamps: false
    },
);

const ServerUser = db.define(
    'ServerUser',
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
        userId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: User, key: "id" }
        },
        serverId: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: Server, key: "id" }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        },
        createdBy: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: { model: User, key: "id" }

        }
    },
    {
        schema: 'chatBot',
        tableName: 'serverUsers',
        timestamps: false,
        indexes: [{  
            unique: true, 
            fields: ["userId", "serverId"] 
        }]
    },
);


module.exports = { User, UserSummary, Server, ServerUser }