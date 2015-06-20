/* collection of game related helper functions */
var $db = require('./mongo');
var debug = require('debug')('wol:leaderboard');
var gameres = require('./gameres');
var $q = require('q');

exports.process = function(game, dmp) {
    var match = gameres(dmp);
    if (!match.idno) return; /* if no game id, discontinue */
    console.log('game: %s, idno: %d', game, match.idno);

    // create raw dump entry
    // TODO: check against spid (sender id) to ensure only 1 packet from each player
    var $dumps = $db.get(game +'_dumps');
    $dumps.update(
        {idno: match.idno},
        {$push: {buffers: match.buffer.toString('utf8')}},
        {upsert: true},
        _stats
    );

    // todo: make this more efficent; no need to update then find
    // should be able to use the same search query
    function _stats(err, data) {
        $dumps.find({idno: match.idno}, function(err, doc) {
            if (doc.length > 1) {
                // error scneario, we have two entries for the same game
                // todo: figure out what the hell to do?
                // todo: elimiate duplicates?
                console.log('found duplicates game: %s, idno: %d', game, match.idno);
                return;
            }

            // only continue if this is the first entry for a game
            if (doc[0].buffers && doc[0].buffers.length > 1) return;

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

            // create game entry if WOLv2
            if (match.client.vers.toLowerCase() === 'v2.0') {
                // mongo.insert(game +'_'+ 'games', dmp);
                // locate ts_games document with matching idno then insert or update
            }
        });
    }

    return;
};
