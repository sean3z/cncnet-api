var $db = require('./mongo');
var $q = require('q');

/* method to search for a quick list of players */
exports.locate = function(game, search) {
    var defer = $q.defer();
    $db.get(game + '_players').find({name: new RegExp(search, 'i')}, function(err, data) {
        defer.resolve(data);
    });

    return defer.promise;
};

/* this method will provide more data that .locate */
/* left join game data */
exports.stats = function(game, player) {
    var defer = $q.defer();
    $db.get(game + '_players').find({name: player}, function(err, data) {
        defer.resolve(data);
    });

    return defer.promise;
};
