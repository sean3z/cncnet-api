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

var Database = require(__dirname +'/Database.js'),
	Player = require(__dirname +'/Player.js'),
	Q = require('q');

var Ladder = {
	save: function(hash, gameres, lid) {
		this.deferred = Q.defer();
		var $this = this;

		var wol_game = {
			lid: lid,
			mid: 1,
			wol_gid: 1, // gameres.IDNO
			duration: gameres.DURA || 300,
			afps: gameres.AFPS || 60,
			crates: gameres.CRAT || 0,
			oosy: gameres.OOSY || 0,
			bases: gameres.BASE || 1,
			credits: gameres.CRED || 1000,
			units: gameres.UNIT || 1,
			tech: gameres.TECH || 10,
			mtime: Math.floor(new Date().getTime() / 1000)
		};

		Database.insert('wol_games', wol_game, function(gid) {
			for (var i in gameres.players) {
				var user = {
					name: gameres.players[i].NAM,
					lid: lid,
					gid: gid,
					stats: gameres.players[i],
					create: true
				};

				Player.locate(user).then($this.stats);
			}

			$this.deferred.resolve(gid);
		});

		return this.deferred.promise;
	},

	stats: function(data) {
		delete data.stats.NAM;

		var stats = {
			gid: data.gid,
			pid: data.pid
		};

		for (var field in data.stats) {
			if (data.stats[field].length < 1) continue;
			stats[field.toLowerCase()] = data.stats[field];
		}

		Database.insert('wol_games_stats', stats);

        var query = Database.format(
            'UPDATE wol_players SET games_count = games_count + 1 WHERE pid = ?', [stats.pid]
        );

        Database.query(query, function(err, results) {
            // do nothing
        });
	}
};

module.exports = Ladder;
