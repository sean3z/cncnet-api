var $db = require('./mongo');
var debug = require('debug')('wol:leaderboard');

exports.process = function(game, match) {
    // create player entry
    var $players = $db.get(game +'_players');
    match.players.forEach(function(player) {
        /* typically Computer */
        if (!player.nam) {
            player.nam = 'Computer';
            return;
        }

        var stats = {
            $push: {games: match.idno},
            $inc: {points: 2}
        };

        $players.update({name: player.nam}, stats, {upsert: true});
    });
};
