/* collection of game related helper functions */
var $db = require('./mongo');
var debug = require('debug')('wol:leaderboard');
var gameres = require('./gameres');
var $q = require('q');

exports.process = function(game, dmp) {
    var match = gameres.parse(dmp);

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

            /* if we have ra stats normalize then carry on  */
            if (game == 'ra') {
                require(__dirname + '/../games/ra').normalize(match);
            }

            // only continue if this is the first entry for a game
            if (doc[0].buffers && doc[0].buffers.length > 1) return;

            /* save game stats */
            gameres.process(game, match);
        });
    }

    return;
};

exports.information = function(game, gameId) {
    var defer = $q.defer();
    $db.get(game +'_games').find({idno: gameId}, function(err, data) {
        if (data.length < 1) return defer.reject();
        defer.resolve(data[0]);
    });
    return defer.promise;
};
