var $db = require(global.cwd + '/lib/mongo'),
    $q = require('q');

global.ladder = {};

var last_update = {
    ts: _timestamp() - 65,
    ra: _timestamp() - 65,
    fs: _timestamp() - 65,
    am: _timestamp() - 65
};

module.exports = function ladder(game, limit) {
    var defer = $q.defer();
    limit = limit || 150;

    defer.resolve((global.ladder[game] || []).slice(0, limit));

    /* if cache theshold elapsed; generate new cache */
    if (last_update[game] < _timestamp() - 60) {
        _notch(game, limit);
    }

    return defer.promise;
};

/* updates leaderboard cache */
function _notch(game) {
    $db.get(game + '_players').find({$where: 'this.points > 0'}, {limit: 1000, sort: {points: -1}}, function(err, data) {
        if (!data || data.length < 1) return;

        data.forEach(function(item, index) {
            item.rank = (index + 1);
            delete item.games;
        });

        global.ladder[game] = data;
        last_update[game] = _timestamp();
    });
}

function _timestamp() {
    return Math.floor(Date.now() / 1000);
}
