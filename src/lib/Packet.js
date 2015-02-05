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

var GameRes = require(__dirname +'/GameResolution.js'),
	Database = require(__dirname +'/Database.js'),
	Ladder = require(__dirname +'/Ladder.js'),
	crypto = require('crypto'),
	Q = require('q');

function Packet(_data) {
	this.packet = _data.packet;
	this.lid = _data.lid;
	this.game = _data.game;

	this.gameres = GameRes.parse(this.packet);
	// this.hash = this.sha1(this.gameres);
    this.hash = this.lid +'_'+ this.gameres.IDNO;
    
	this.deferred = Q.defer();
}

Packet.prototype.handle = function() {
	var $this = this;

	var query = Database.format(
		'SELECT gid FROM wol_games_raw WHERE hash = ?', [this.hash]
	);

	Database.query(query, function(err, data) {
		if (data.length < 1) {
			// save raw game
			Database.insert('wol_games_raw', {
				hash: $this.hash,
				packet: $this.packet,
				lid: $this.lid,
				ctime: Math.floor(new Date().getTime() / 1000)
			});

			$this.queued();
		} else {
			// do NOT delete hash; cron will cleanup
			if (data[0].gid) {
				$this.processed(data[0].gid);

			} else {
				// we have at least 2 of the same packet; create game
				Ladder.save($this.hash, $this.gameres, $this.lid).then(function(gid) {
					Database.query(
						'UPDATE wol_games_raw SET gid = ? WHERE hash = ?', [gid, $this.hash]
					);

					$this.processed(gid);
				});
			} 
		}
	});

	return this.deferred.promise;
};

Packet.prototype.sha1 = function(gameres) {
	var unique = [
		gameres.IDNO, gameres.DURA,
		gameres.SCEN, gameres.OOSY,
		gameres.CRED, gameres.TECH,
		gameres.CRAT, gameres.DATE
	].join('');

	return crypto.createHash('sha1').update(unique).digest('hex');
};

Packet.prototype.queued = function() {
	this.deferred.resolve({
		status: 202
	});
};

Packet.prototype.processed = function(gid) {
	this.deferred.resolve({
		status: 201,
		location: ['/ladder', this.game, 'game', gid].join('/')
	});
};

module.exports = Packet;