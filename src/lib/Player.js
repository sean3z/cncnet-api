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
	locate: function(player) {
		var deferred = Q.defer();

		if (!player.name || !player.lid) {
			deferred.reject({
				status: 400
			});

			return deferred.promise;
		}

		var query = Database.format(
			'SELECT pid, uid FROM wol_players WHERE name = ? AND lid = ?', [player.name, player.lid]
		);

		Database.query(query, function(err, result) {
			if (result.length < 1) {
				if (!!player.create) {
					var ctime = Math.floor(new Date().getTime() / 1000);
					var insert = {
						name: player.name,
						lid: player.lid,
						ctime: ctime,
						mtime: ctime
					};

					if (player.uid) {
						insert.uid = player.uid;
					}

					Database.insert('wol_players', insert, function(pid) {
						player.pid = pid;
						deferred.resolve(player);
					});
				} else {
					deferred.reject({
						status: 404
					});
				}
			} else {
				player.pid = result[0].pid;
				player.uid = result[0].uid;
				deferred.resolve(player);
			}
		});

		return deferred.promise;
	}
};

module.exports = Player;