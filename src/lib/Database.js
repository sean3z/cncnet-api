/***
*   Copyright 2014 Sean Wragg <seanwragg@gmail.com>
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*	   http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

var mysql = require('mysql');

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

	insert: function(table, data, callback) {
		if (typeof data === 'object') {
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
					if (err) console.log('Error', err, '\r\nQuery', query);
					if (callback) callback(result.insertId);

					connection.release();
				});
			});
		} 
	},

	query: function(query, callback) {
		this.pool.getConnection(function(err, connection) {
			connection.query(query, callback);

			connection.release();
		});
	},

	format: function(sql, inserts) {
		return mysql.format(sql, inserts);
	}
};

module.exports = Database;