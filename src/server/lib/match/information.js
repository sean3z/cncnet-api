var $db = require(global.cwd + '/lib/mongo'),
    $q = require('q');

module.exports = function information(game, gameId) {
    var defer = $q.defer();
    $db.get(game +'_games').find({idno: gameId}, function(err, data) {
        if (data.length < 1) return defer.reject();
        defer.resolve(data[0]);
    });
    return defer.promise;
};
