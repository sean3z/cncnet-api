var $db = require(global.cwd + '/lib/mongo');
var debug = require('debug')('wol:leaderboard');
var gameres = require(global.cwd + '/lib/gameres');
var parse = require(global.cwd + '/lib/match/lib/parse');

module.exports = function process(game, match) {
    // discontinue if missing idno for any reason
    if (!match.idno) return;

    var $dumps = $db.get(game +'_dumps');

    $dumps.findOne({idno: match.idno}, function(err, doc) {
        // only continue if we have a game entry
        if (!doc || !doc.buffers || !doc.buffers.length) return;

        /* process each buffer */
        doc.buffers.forEach(function(buffer, index) {
            doc.buffers[index] = parse(game, gameres.parse(buffer.buffer));
        });

        switch (match.players.length) {
            case 2:
                /* processing for singles games */
                debug('game: %s, idno: %d is singles', game, match.idno);
                require('./lib/singles')(game, match, doc.buffers);

                /* @TODO: check if clan match */
            break;
        }
    });
};
