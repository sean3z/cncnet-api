var $db = require(global.cwd + '/lib/mongo');
var debug = require('debug')('wol:leaderboard');
var gameres = require('../gameres');
var ranking = require('../ranking');

module.exports = function process(game, dmp) {
    var match = require(__dirname + '/lib/parse')(game, gameres.parse(dmp));

    /* discontinue if no game id or match is less than 1 minute */
    if (!match.idno || match.dura < 60) return;
    debug('game: %s, idno: %d', game, match.idno);

    // create raw dump entry
    // TODO: check against spid (sender id) to ensure only 1 packet from each player
    // TODO: idno is random but could collide. check if record exists and compare dates
    var $dumps = $db.get(game +'_dumps');
    $dumps.update(
        {idno: match.idno},
        {$push: {buffers: match.buffer}},
        {upsert: true},
        _stats
    );

    function _stats(err, data) {
        $dumps.find({idno: match.idno}, function(err, doc) {
            if (doc.length > 1) {
                // error scneario, we have two entries for the same game
                // todo: figure out what the hell to do?
                // todo: elimiate duplicates?
                debug('found duplicates! game: %s, idno: %d', game, match.idno);
                return;
            }

            // only continue if this is the first entry for a game
            if (doc[0].buffers && doc[0].buffers.length > 1) return;

            /* save game stats */
            $db.get(game +'_games').insert(match).success(function(doc) {
                ranking.process(game, match);
                debug('game: %s, idno: %d saved!', game, match.idno);
            });

        });
    }

    return;
};
