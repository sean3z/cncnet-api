var $db = require('../lib/mongo');
var debug = require('debug')('wol:leaderboard');

exports.process = function(game, match) {
    // only continue if we have proper stats
    // TODO: figure out why cmp is 2 or 8
    if ([2, 8].indexOf(match.players[0].cmp) > -1) return;

    // create player entry
    var $players = $db.get(game +'_players');
    match.players.forEach(function(player) {
        /* typically Computer */
        if (!player.nam) {
            player.nam = 'Computer';
            return;
        }

        // TODO: increase player map count
        var stats = {
            $push: {games: match.idno},
            $inc: {points: 2}
        };

        /* evaluate wolv2 completions */
        // 256 is won, 512 is defeated
        // 528 is lost connection or kicked
        // NEED TO KNOW CMP: 2,8
        if (player.cmp) {
            stats.$inc[(player.cmp == 256 ? 'wins' : 'losses')] = 1;
            if (player.cmp == 528) stats.$inc.disconnects = 1;
            if (player.cmp == 256) stats.$inc.points += 4;
        }

        $players.update({name: player.nam}, stats, {upsert: true});

        /* tack on stats so it can be referenced in game object */
        player.__gained = stats.$inc;
    });

    // create game entry
    delete match.buffer;
    $db.get(game +'_games').insert(match);

    /* handle any game specific processing */
    require('../game/' + game).process(match);
};
