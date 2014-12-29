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

var _database = require('./Database.js'),
	_player = require('./Player.js');

var Ladder = {
	save: function(hash, game, lid, callback) {
		var $this = this;

		var wol_game = {
			lid: lid,
			mid: 1,
			wol_gid: 1, // game.IDNO
			duration: game.DURA || 300,
			afps: game.AFPS || 60,
			crates: game.CRAT || 0,
			oosy: game.OOSY || 0,
			bases: game.BASE || 1,
			credits: game.CRED || 1000,
			units: game.UNIT || 1,
			tech: game.TECH || 10,
			mtime: Math.floor(new Date().getTime() / 1000)
		};

		_database.insert('wol_games', wol_game, function(gid) {
			for (var i in game.players) {
				var user = {
					name: game.players[i].NAM,
					lid: lid,
					gid: gid,
					stats: game.players[i]
				};

				_player.locate(user, $this.stats);
			}

			callback(gid);
		});
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

		_database.insert('wol_games_stats', stats);
	}
};

module.exports = Ladder;