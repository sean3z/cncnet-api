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
            $auth.find({username: username, password: password}, function(err, data) {
                data =  data || [];

                if (data.length < 1) {
                    return reject();
                }

                data.forEach(function(item) {
                    delete item.username;
                    delete item.password;
                });

                resolve(data);
            });
        }

        function playerAuth() {
            player = player.toLowerCase();

            $auth.findOne({name: _sanitize(player, true)}, function(err, data) {
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

                    /* otherwise create auth entry */
                    var entry = {
                        name: player,
                        username: username,
                        password: password,
                        registered: Date.now()
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
