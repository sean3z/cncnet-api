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
            scene: gameres.SCNE || 'No Map',
			wol_gid: gameres.IDNO || 1,
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
                    oosy: wol_game.oosy,
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

        var _stats = {
            wins: 0,
            loss: 0,
            oosy: 0,
            points: 0
        };

		for (var field in data.stats) {
			if (data.stats[field].length < 1) continue;
			stats[field.toLowerCase()] = data.stats[field];
		}

		Database.insert('wol_games_stats', stats);

        // if RA2,YR,TS or FS
        if ([2,4,5,7].indexOf(data.lid) > -1) {
            if (parseInt(data.stats.CMP) == 512) {
                _stats.wins = 1;
                _stats.points = 20;
            } else if (parseInt(data.stats.CMP) == 256) {
                _stats.loss = 1;
                _stats.points = 10;
            }
        }

        if (parseInt(data.oosy) > 0) {
            _stats.oosy = 1;
        }

        var query = Database.format(
            'UPDATE wol_players SET games_count = games_count + 1, win_count = win_count + ?, loss_count = loss_count + ?, oos_count = oos_count + ?, points = points + ? WHERE pid = ?', [_stats.wins, _stats.loss, _stats.oosy, _stats.points, stats.pid]
        );

        Database.query(query, function(err, results) {});
	}
};

module.exports = Ladder;
