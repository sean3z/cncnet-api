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

        /* evaluate wolv2 completions */
        // 256 is won, 512 is defated
        // 528 is lost connection or kicked
        if (player.cmp) {
            stats.$inc[(player.cmp == 256 ? 'wins' : 'losses')] = 1;
            if (player.cmp == 528) stats.$inc.disconnects = 1;
            if (player.cmp == 256) stats.$inc.points += 10;
        }

        $players.update({name: player.nam}, stats, {upsert: true});
    });

    // create game entry
    $db.insert(game +'_games', match);
};
