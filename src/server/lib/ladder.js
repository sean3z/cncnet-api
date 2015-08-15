var $db = require('./mongo');
var $q = require('q');
var last_update = {
    ts: _timestamp() - 350,
    ra: _timestamp() - 350,
    fs: _timestamp() - 350,
    am: _timestamp() - 350
};

exports.player = function(game, limit) {
    var defer = $q.defer();

    $db.get(game + '_ladder').find({}, {limit: limit, sort: {rank: 1}}, function(err, data) {
        defer.resolve(data);

        /* if cache theshold elapsed; generate new cache*/
        _notch(game);
       // if (last_update[game] < _timestamp() - 300) _notch(game);
    });

    return defer.promise;
};

/* updates leaderboard cache */
function _notch(game) {
    $db.get(game + '_players').find({}, {limit: 500, sort: {points: -1}}, function(err, data) {
        if (data.length < 1) return;

        data.forEach(function(item, index) {
            item.rank = (index + 1);
            delete item.games;
        });

        $db.get(game + '_ladder').drop();
        $db.get(game + '_ladder').insert(data, function(err, doc) {
            last_update[game] = _timestamp();
        });
    });
}

function _timestamp() {
    return Math.floor(Date.now() / 1000);
}
