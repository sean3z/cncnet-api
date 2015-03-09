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
	locate: function(search) {
		var deferred = Q.defer();

		if (!search.name || !search.lid) {
			deferred.reject({
				status: 400
			});

			return deferred.promise;
		}

		var query = Database.format(
			'SELECT pid, uid FROM wol_players WHERE name = ? AND lid = ?', [search.name, search.lid]
		);

		Database.query(query, function(err, result) {
            if (result.length > 0) {
                search.pid = result[0].pid;
				search.uid = result[0].uid;
				search.exists = true; // player located
				return deferred.resolve(search);
            }

            if (search.create) {
                // create player
                var insert = {
                    name: search.name,
                    lid: search.lid,
                    ctime: Math.floor(new Date().getTime() / 1000)
                };

                if (search.uid) {
                    insert.uid = search.uid;
                }

                Database.insert('wol_players', insert, function(pid) {
                    search.pid = pid;
                    deferred.resolve(search);
                });

                return;
            }

            // return player not found
            return deferred.reject({
                status: 404
            });
		});

		return deferred.promise;
	}
};

module.exports = Player;
