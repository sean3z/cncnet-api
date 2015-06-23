var $db = require('../lib/mongo');
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

        /* tack on stats so it can be referenced in game object */
        player.__gained = stats.$inc;
    });

    // create game entry
    delete match.buffer;
    $db.get(game +'_games').insert(match);
};
