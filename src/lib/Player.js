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

var Database = require('./Database.js'),
	Q = require('q');

var Player = {
	locate: function(data) {
		var deferred = Q.defer();

		var query = Database.format(
			'SELECT pid FROM wol_players WHERE name = ? AND lid = ?', [data.name, data.lid]
		);

		Database.query(query, function(err, result) {
			if (result.length < 1) {
				if (!!data.create) {
					var ctime = Math.floor(new Date().getTime() / 1000);
					var player = {
						name: data.name,
						lid: data.lid,
						ctime: ctime,
						mtime: ctime
					};

					Database.insert('wol_players', player, function(pid) {
						data.pid = pid;
						deferred.resolve(data);
					});
				} else {
					deferred.resolve({
						status: 404
					});
				}
			} else {
				data.pid = result[0].pid;
				deferred.resolve(data);
			}
		});

		return deferred.promise;
	},

	create: function(data) {
		var deferred = Q.defer();

		if (!data.username || !data.password || !data.email) {
			deferred.resolve({
				status: 400
			});

			return false;
		}



		return deferred.promise;
	}
};

module.exports = Player;