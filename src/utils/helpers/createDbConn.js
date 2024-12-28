const { Sequelize } =  require("sequelize");

const createDbConn = ({ username, password, logging, host, port = 5432, dialect = 'postgresql' }) => new Sequelize({ host, port, username, password, dialect, logging });

module.exports = createDbConn