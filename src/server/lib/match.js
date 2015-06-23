/* collection of game related helper functions */
var $db = require('./mongo');
var debug = require('debug')('wol:leaderboard');
var gameres = require('./gameres');
var $q = require('q');

exports.process = function(game, dmp) {
    var match = gameres(dmp);
    // if (!match.idno) return; /* if no game id, discontinue */
    debug('game: %s, idno: %d', game, match.idno);

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

            switch(match.client.vers.toLowerCase()) {
                case 'v2.0':
                    require('../WOL/v2').process(game, match);
                break;

                default:
                    require('../WOL/v1').process(game, match);
            }
        });
    }

    return;
};

exports.information = function(game, gameId) {
    var defer = $q.defer();
    $db.get(game +'_games').find({idno: gameId}, function(err, data) {
        defer.resolve(data);
    });
    return defer.promise;
};
