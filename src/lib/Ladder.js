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

function Ladder(_database) {
	this._database = _database;
}

Ladder.prototype.save = function(hash, game, lid, callback) {
	var wol_games = {
		lid: lid,
		mid: 1,
		wol_gid: 0,
		duration: game.DURA,
		afps: game.AFPS,
		crates: game.CRAT,
		oosy: game.OOSY,
		bases: game.BASE,
		credits: game.CRED,
		units: game.UNIT,
		tech: game.TECH,
		mtime: Math.floor(new Date().getTime() / 1000)
	};

	this._database.insert('wol_games', wol_games, function(gid) {
		callback(gid);
		// @TODO: insert into wol_players and wol_game_stats
	});
};

module.exports = Ladder;