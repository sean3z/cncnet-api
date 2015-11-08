var mysql = require('mysql'),
    config = require(global.cwd + '/config');

var Database = {
    db: undefined,
    pool: {},
    configure: function(config) {
        this.pool = mysql.createPool({
            host: config.hostname,
            user: config.username,
            password: config.password,
            database: config.database,
            connectionLimit: 10
        });
    },

    query: function(query, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) throw err;

            connection.query(query, function(err, response) {
                if (err) throw err;

                callback(err, response);
                connection.release();
            });
        });
    },

    format: function(sql, inserts) {
        return mysql.format(sql, inserts);
    }
};

Database.configure(config.mysql);

module.exports = Database;
