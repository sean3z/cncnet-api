/* jshint expr: true */

var debug = require('debug')('wol:leaderboard'),
    $db = require(global.cwd + '/lib/mongo'),
    games = require(global.cwd + '/lib/games'),
    _sanitize = require('./lib/sanitize');

module.exports = function auth(player, username, password) {
    return new Promise(function(resolve, reject) {
        if (!username || !password) {
            return reject();
        }

        var $auth = $db.get('auth');

        player ? playerAuth() : regularAuth();

        ///////////////////

        function regularAuth() {
            $auth.findOne({username: username, password: password}, function(err, data) {

                /* unable to find user/pass combo*/
                if (!data) return reject();

                /* remove sensitive data from reply */
                delete data.password;

                resolve(data);
            });
        }

        function playerAuth() {
            player = player.toLowerCase();

            $auth.findOne({handles: {$in: [_sanitize(player, true)]}}, function(err, data) {
                data = data || {};

                /* success if player enters correct user/pass */
                if (data.username === username && data.password === password) {
                    return resolve();
                }

                /* if player is already associated to another username, reject */
                if (data.username && data.username !== username) {
                    return reject();
                }

                /* check to see if the username exists */
                $auth.findOne({username: username}, function(err, res) {
                    res = res || {};

                    /* if we already have a user/pass reject */
                    if (res.username && res.password !== password) {
                        return reject();
                    }

                    /* if username exists, add new handle */
                    if (res.username) {
                        $auth.update({username: username}, {
                            $push: {
                                handles: player
                            }
                        });

                        return resolve();
                    }

                    /* otherwise create auth entry */
                    var entry = {
                        username: username,
                        password: password,
                        registered: Date.now(),
                        handles: [
                            player
                        ]
                    };

                    $auth.insert(entry).success(function() {
                        debug('auth entry created for %s', player);
                        resolve();
                        associate(player, entry);
                    });
                });
            });
        }
    });
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
                        username: entry.username
                    }
                }, {upsert: true});
            }
        });
    });
}
