var debug = require('debug')('wol:leaderboard'),
    $db = require(global.cwd + '/lib/mongo'),
    games = require(global.cwd + '/lib/games'),
    _sanitize = require('./lib/sanitize'),
    $q = require('q');

module.exports = function auth(player, username, password) {
    var deferred = $q.defer();

    if (!player || !username || !password) {
        return deferred.reject();
    }

    player = player.toLowerCase();

    var $auth = $db.get('auth');
    $auth.findOne({name: _sanitize(player, true)}, function(err, data) {
        data = data || {};

        /* success if player enters correct user/pass */
        if (data.username === username && data.password === password) {
            return deferred.resolve();
        }

        /* otherwise create auth entry */
        if (!data.username && !data.password) {
            var entry = {
                name: player,
                username: username,
                password: password,
                registered: Date.now()
            };

            $auth.insert(entry).success(function() {
                debug('auth entry created for %s', player);
                deferred.resolve();
                associate(player, entry);
            });

            return;
        }

        deferred.reject();
    });

    return deferred.promise;
};

/* add uid to given player in all supported games */
function associate(player, entry) {
    games.supported.forEach(function(game) {
        var $players = $db.get(game + '_players');
        $players.findOne({name: _sanitize(player, true)}, function(err, data) {
            data = data || {};

            /* associate if not already claimed */
            if (!data.username && !data.password) {
                $players.update({name: player}, {
                    $set: {
                        name: player,
                        username: entry.username,
                        password: entry.password
                    }
                }, {upsert: true});
            }
        });
    });
}
