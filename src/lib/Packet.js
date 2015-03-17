var GameRes = require(__dirname +'/GameResolution.js'),
	Database = require(__dirname +'/Database.js'),
	Ladder = require(__dirname +'/Ladder.js'),
	Q = require('q');

function Packet(_data) {
	this.packet = _data.packet;
	this.lid = _data.lid;
	this.game = _data.game;

	this.gameres = GameRes.parse(this.packet);
    this.hash = this.lid + '_' + this.gameres.IDNO;
    
	this.deferred = Q.defer();
}

Packet.prototype.handle = function() {
	var self = this;

	var query = Database.format(
		'SELECT hash, gid FROM wol_games_raw WHERE hash = ?', [this.hash]
	);

	Database.query(query, function(err, data) {
		if (data.length < 1) {
			// hash not found, save raw game
			Database.insert('wol_games_raw', {
				hash: self.hash,
				packet: self.packet,
				lid: self.lid,
				ctime: Math.floor(new Date().getTime() / 1000)
			});

            self.deferred.resolve({
                status: 202
            });
		} else {
			// game already associated; do NOT remove hash - cron will cleanup
			if (parseInt(data[0].gid) > 0) return self.processed(data[0].gid);

            // we have at least 2 of the same packet; create game
            Ladder.save(self.hash, self.gameres, self.lid).then(function(gid) {
                var query = Database.format(
                    'UPDATE wol_games_raw SET gid = ? WHERE hash = ?', [gid, self.hash]
                );
                Database.query(query);

                self.processed(gid);
            });
		}
	});

	return this.deferred.promise;
};

Packet.prototype.processed = function(gid) {
	this.deferred.resolve({
		status: 201,
		location: ['/ladder', this.game, 'game', gid].join('/')
	});
};

module.exports = Packet;
