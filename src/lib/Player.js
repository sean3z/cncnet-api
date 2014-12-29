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

var _database = require('./Database.js');

var Player = {
	locate: function(data, callback) {
		var query = _database.format(
			'SELECT pid FROM wol_players WHERE name = ? AND lid = ?', [data.name, data.lid]
		);

		_database.query(query, function(err, result) {
			if (result.length < 1) {
				var ctime = Math.floor(new Date().getTime() / 1000);
				var player = {
					name: data.name,
					lid: data.lid,
					ctime: ctime,
					mtime: ctime
				};

				_database.insert('wol_players', player, function(pid) {
					data.pid = pid;
					callback(data);
				});
			} else {
				data.pid = result[0].pid;
				callback(data);
			}
		});
	}
};

module.exports = Player;