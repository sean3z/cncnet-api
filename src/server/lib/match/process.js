var $db = require(global.cwd + '/lib/mongo'),
    debug = require('debug')('wol:leaderboard'),
    ranking = require('../ranking'),
    MATCH_DELAY = process.env.MATCH_DELAY || 90000;

module.exports = function process(game, dump) {
    var match = require(__dirname + '/lib/parse')(game, dump);

    /* discontinue if no gameId or match is less than 1 minute */
    if (!match.idno || match.dura < 60) return;
    debug('game: %s, idno: %d game received', game, match.idno);

    // create raw dump entry
    // TODO: check against spid (sender id) to ensure only 1 packet from each player
    // TODO: idno is random but could collide. check if record exists and compare dates
    var $dumps = $db.get(game +'_dumps');
    $dumps.update({idno: match.idno}, {$push: {buffers: match.buffer}}, {upsert: true}).error(function(err) {
        console.log('match/process dump entry error');
        console.log('game: %s, match: %d', game, match.idno);
        console.log('buffer: %s', match.buffer.toString('hex'));
        console.dir(err);
    });

    // remove unused properties from game object
    delete match.buffer; /* only used for previous parsing */
    delete match.client; /* unused information about the client */

    /* save match */
    var p = $db.get(game +'_games').insert(match);
    p.success(function(doc) {
        debug('game: %s, idno: %d game saved!', game, match.idno);

        /* process rankings at a 1.5 minute delay */
        /* this allows time for all packets to arrive */
        setTimeout(function() {
            ranking.process(game, match);
        }, MATCH_DELAY);
    });

    p.error(function(err) {
        console.log('error');
        console.dir(err);
    });

    return;
};
