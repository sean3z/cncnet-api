var mysql = require('mysql');
var q = require('q'); 

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

	insert: function(table, data) {
		if (typeof data !=== 'object') return;
        
        var fields = [], values = [];
        for (var key in data) {
            fields.push(key);
            values.push(data[key]);
        }

        var query = mysql.format(
            'INSERT INTO ?? (??) VALUES (?)', [table, fields, values]
        );

        this.pool.getConnection(function(err, connection) {
            connection.query(query, function(err, result) {
                connection.release();

                if (err) console.log('MySQL Error:', err, '\r\nMySQL Query:', query);
                if (callback) callback(result.insertId);
            });
        });
	},

	query: function(query, callback) {
		this.pool.getConnection(function(err, connection) {
			connection.query(query, function(err, response) {
                connection.release();
                
                callback(err, response);
            });
		});
	},

	format: function(sql, inserts) {
		return mysql.format(sql, inserts);
	}
};

module.exports = Database;
