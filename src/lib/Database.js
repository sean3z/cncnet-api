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
	config: {},
	configure: function(config) {
		this.config = {
			host: config.hostname,
			user: config.username,
			password: config.password,
			database: config.database,
			connectTimeout: 0
		};
	},

	connect: function() {
		this.db = new mysql.createConnection(this.config);
		this.db.connect();
	},

	end: function() {
		this.db.end();
	},

	insert: function(table, data, callback) {
		if (typeof data === 'object') {
			var fields = [], values = [];
			for (var key in data) {
				fields.push(key);
				values.push(data[key]);
			}

			this.db.query(
				'INSERT INTO ?? (??) VALUES (?)', [table, fields, values], function(err, result) {
					if (err) throw err;
					if (callback) callback(result.insertId);
				}
			);
		} 
	},

	query: function(query, callback) {
		this.db.query(query, callback);
	},

	format: function(sql, inserts) {
		return this.db.format(sql, inserts);
	}
};

module.exports = Database;