var $db = require(global.cwd + '/lib/mongo'),
    $q = require('q');

global.ladder = {};

var last_update = {};

module.exports = function ladder(game, limit) {
    var defer = $q.defer();
    limit = limit || 150;

    defer.resolve((global.ladder[game] || []).slice(0, limit));

    /* if cache threshold elapsed; generate new cache */
    if ((last_update[game] || 0) < _timestamp() - 60) {
        _notch(game, limit);
    }

    return defer.promise;
};

/* updates leaderboard cache */
function _notch(game) {
    $db.get(game + '_players').find({points: {$gt: 0}, 'games.0': {$exists: true}}, {limit: 1000, sort: {points: -1}}, function(err, data) {
        if (!data || data.length < 1) return;

        data.forEach(function(item, index) {
            item.rank = (index + 1);
            delete item.games;

            /* remove sensitive data */
            delete item.username;
            delete item.password;
        });

        global.ladder[game] = data;
        last_update[game] = _timestamp();
    });
}

function _timestamp() {
    return Math.floor(Date.now() / 1000);
}
