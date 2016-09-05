var debug = require('debug')('wol:leaderboard');
var $db = require(global.cwd + '/lib/mongo');
var _sanitize = require(global.cwd + '/lib/player/lib/sanitize');

module.exports = function create(game, clan, player) {
    return new Promise(function(resolve, reject) {
        var $clans = $db.get(game +'_clans');
        var $players = $db.get(game +'_players');

        player = player.toLowerCase();

        // check if player is in clan
        $players.findOne({name: _sanitize(player, true)}, function(err, player_data) {
            if (player_data.clan) return reject(); // player already in clan

            // check if clan already exists
            $clans.findOne({name: _sanitize(clan, true)}, function(err, clan_data) {
                if (clan_data) return reject(); // clan already exists

                // create clan and add player to it
                var record = {
                    name: clan.toLowerCase(),
                    nam: clan,
                    created: Math.floor(Date.now() / 1000),
                    points: global.DEFAULT_POINTS,
                    games: [],
                    founder: player,
                    members: [
                        player
                    ]
                };

                $clans.insert(record).success(function() {
                    /* add clan to player record */
                    $players.update({name: _sanitize(player, true)}, {
                        $set: {
                            clan: clan
                        }
                    });

                    resolve();
                });
            });
        });
    });
};