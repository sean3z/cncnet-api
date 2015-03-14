var Database = require('./Database.js'),
	Q = require('q');

var Player = {
	locate: function(search) {
		var deferred = Q.defer();

        // @hack: if name is empty, use Computer
        if (!search.name) {
            search.name = 'Computer';
        }

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

            // create player if flag true
            if (search.create) {
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
