/* jshint expr: true */

var debug = require('debug')('wol:leaderboard'),
    $db = require(global.cwd + '/lib/mongo'),
    games = require(global.cwd + '/lib/games'),
    _sanitize = require('./lib/sanitize');

module.exports = function auth(email, password, nick) {
    return new Promise(function(resolve, reject) {
        if (!email || !password) {
            return reject();
        }

        var $auth = $db.get('auth');

        nick ? playerAuth() : regularAuth();

        ///////////////////

        function regularAuth() {
            $auth.findOne({email: email, password: password}, function(err, data) {

                /* unable to find email/pass combo*/
                if (!data) return reject();

                /* remove sensitive data from reply */
                delete data.password;

                resolve(data);
            });
        }

        function playerAuth() {
            email = email.toLowerCase();

            $auth.findOne({handles: {$in: [_sanitize(nick, true)]}}, function(err, data) {
                data = data || {};

                /* success if player enters correct user/pass */
                if (data.email === email && data.password === password) {
                    return resolve();
                }

                if (data.email && data.email !== email) {
                    debug("auth: incorrect email");
                    return reject();
                }

                /* update existing email */
                $auth.findOne({email: email}, function(err, res) {
                    res = res || {};

                    /* if we already have a user/pass reject */
                    if (res.email && res.password !== password) {
                        return reject();
                    }

                    /* if email exists, add new handle */
                    if (res.email) {
                        $auth.update({email: email}, {
                            $push: {
                                handles: nick
                            }
                        });

                        debug('auth entry updated for %s', email);
                        resolve();
                        associate(nick, email);
                        return;
                    }

                    /* otherwise create auth entry */
                    var entry = {
                        email: email,
                        password: password,
                        registered: Date.now(),
                        handles: [
                            nick
                        ]
                    };

                    $auth.insert(entry).success(function() {
                        debug('auth entry created for %s', email);
                        resolve();
                        associate(nick, email);
                    });
                });
            });
        }
    });
};

/* add uid to given player in all supported games */
function associate(player, email) {
    games.supported.forEach(function(game) {
        var $players = $db.get(game + '_players');
        $players.findOne({name: _sanitize(player, true)}, function(err, data) {
            data = data || {};

            /* associate if not already claimed */
            if (!data.email) {
                $players.update({name: player}, {
                    $set: {
                        name: player,
                        email: email
                    }
                }, {upsert: true});
            }
        });
    });
}
