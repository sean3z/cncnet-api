var $db = require('./mongo');
var $q = require('q');
var last_update = {};
last_update['ts'] = _timestamp() - 350;
last_update['ra'] = _timestamp() - 350;

exports.player = function(game, limit) {
    var defer = $q.defer();
    _notch(game).then(function() {
        $db.get(game + '_ladder').find({}, {limit: limit, sort: {rank: 1}}, function(err, data) {
            // data.push({last_update: last_update[game]});
            defer.resolve(data);
        });
    });

    return defer.promise;
};

function _notch(game) {
    var defer = $q.defer();

    if (last_update[game] > _timestamp() - 300) {
        defer.resolve();
        return defer.promise;
    }
    console.log('updated');
    $db.get(game + '_players').find({}, {sort: {points: -1}}, function(err, data) {
        data.forEach(function(item, index) {
            item.rank = (index + 1);
        });
        $db.get(game + '_ladder').drop();
        $db.get(game + '_ladder').insert(data, function(err, doc) {
            last_update[game] = _timestamp();
            defer.resolve();
        });
    });

    return defer.promise;
}

function _timestamp() {
    return Math.floor(Date.now() / 1000);
}
