var $db = require('./mongo');
var $q = require('q');

exports.player = function(game, limit) {
    var defer = $q.defer();

    $db.get(game + '_players').find({}, {limit: limit, sort: {points: -1}}, function(err, data) {
        defer.resolve(data);
    });

    return defer.promise;
}
