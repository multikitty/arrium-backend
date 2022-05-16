const config = require('./config')

const Sequelize = require('sequelize');
let sequelize;

if (process.env.NODE_ENV === "development") {
    sequelize = new Sequelize(config.development.database, config.development.db_user, config.development.db_password, {
        dialect: 'mysql',
        host: config.development.host,
    });
} else {
    sequelize = new Sequelize(config.production.database, config.production.db_user, config.production.db_password, {
        dialect: 'mysql',
        host: config.production.host,
    });
}

module.exports = sequelize;