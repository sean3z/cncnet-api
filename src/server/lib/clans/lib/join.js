var debug = require('debug')('wol:leaderboard');
var $db = require(global.cwd + '/lib/mongo');
var _sanitize = require(global.cwd + '/lib/player/lib/sanitize');

module.exports = function modify(game, clan, options) {
    var player = (options.player || '').toLowerCase();
    delete options.player;

    var $clans = $db.get(game +'_clans');
    var $players = $db.get(game +'_players');

    return new Promise(function(resolve, reject) {
        $clans.findOne({name: _sanitize(clan, true)}, function(err, clan_data) {
            if (!clan_data) return reject();

            $players.findOne({name: _sanitize(player, true)}, function(err, player_data) {
                // ensure player is not in another clan
                if (player_data.clan) return reject();

                // if no password set, noone can join
                if (!clan_data.password) return reject();

                // ensure player entered the correct password
                if (clan_data.password == options.password) {
                    $players.update({name: _sanitize(player, true)}, {
                        $set: {
                            clan: clan
                        }
                    });

                    $clans.update({name: _sanitize(clan, true)}, {
                        $push: {
                            members: player
                        }
                    });

                   return resolve(); 
                }

                return reject();
            });
        });
    });
};