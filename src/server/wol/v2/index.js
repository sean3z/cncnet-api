var $db = require(__dirname + '/../../lib/mongo');
var debug = require('debug')('wol:leaderboard');

exports.process = function(game, match) {
    match.teams = []; /* teams[teamId] = [player1, player3] */

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
            $inc: {points: 1}
        };

        /* evaluate wolv2 completions */
        if (player.cmp) {
            switch (player.cmp) {
                case 2:
                    stats.$inc.disconnects = 1;
                break;

                case 256:
                    stats.$inc.points += 3;
                    stats.$inc.wins = 1;
                break;

                case 512:
                case 528:
                    stats.$inc.losses = 1;
                break;
            }
        }

        /* remove unused info */
        delete player.ipa; /* could be tunnel or p2p (unreliable) */
        delete player.addr; /* same reason but for ra1 */
        delete player.ser; /* serials are not used on CnCNet */

        $players.update({name: player.nam}, stats, {upsert: true});

        /* associate player by teamId */
        match.teams[player.tid] = match.teams[player.id] || [];
        match.teams[player.tid].push(player.nam);

        /* tack on stats so it can be referenced in game object */
        player.__gains = stats.$inc;
    });

    // create game entry
    delete match.buffer; /* only used for additional parsing */
    delete match.client; /* ununsed information about the client */

    $db.get(game +'_games').insert(match);

    /* handle any game specific processing */
    require('../game/' + game).process(match);
};
