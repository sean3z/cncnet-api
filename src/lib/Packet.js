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

var _gameres = require(__dirname +'/GameResolution.js'),
	_database = require(__dirname +'/Database.js'),
	_ladder = require(__dirname +'/Ladder.js'),
	crypto = require('crypto');

function Packet(_data) {
	this.packet = _data.packet;
	this.lid = _data.lid;

	this.game = _gameres.parse(this.packet);
	this.hash = this.sha1(this.game);
}

Packet.prototype.handle = function(callback) {
	var $this = this, callback = callback || function(){};

	var query = _database.format(
		'SELECT gid FROM wol_games_raw WHERE hash = ?', [this.hash]
	);

	_database.query(query, function(err, data) {
		if (data.length < 1) {
			// save raw game
			_database.insert('wol_games_raw', {
				hash: $this.hash,
				packet: $this.packet,
				lid: $this.lid,
				ctime: Math.floor(new Date().getTime() / 1000)
			});

			callback({
				code: '0x01',
				message: 'Game saved in raw format'
			});
		} else {
			// do NOT delete hash; cron will cleanup
			// we have at least 2 of the same packet; create game
			if (!data[0].gid) {
				
				_ladder.save($this.hash, $this.game, $this.lid, function(gid) {
					_database.query(
						'UPDATE wol_games_raw SET gid = ? WHERE hash = ?', [gid, $this.hash]
					);

					callback({
						code: '0x02',
						message: 'Game saved'
					});
				});

			} else {
				callback({
					code: '0x03',
					message: 'Game already saved'
				});
			}
		}
	});
};

Packet.prototype.sha1 = function(game) {
	var unique = [
		game.IDNO, game.DURA,
		game.SCEN, game.OOSY,
		game.CRED, game.TECH,
		game.CRAT, game.DATE
	].join('');

	return crypto.createHash('sha1').update(unique).digest('hex');
};

module.exports = Packet;