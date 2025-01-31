const { Sequelize } =  require("sequelize");

const createDbConn = ({ username, password, database, logging, host, port = 5432, dialect = 'postgresql' }) => new Sequelize({ host, port, database, username, password, dialect, logging });

module.exports = createDbConn