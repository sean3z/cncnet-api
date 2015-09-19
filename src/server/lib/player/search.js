var $db = require(global.cwd + '/lib/mongo');
var $q = require('q');
var _sanitize = require('./lib/sanitize');

/* method to search for a quick list of players by name */
module.exports = function search(game, search) {
    var defer = $q.defer();
    $db.get(game + '_players').find({name: _sanitize(search, false)}, {limit: 10}, function(err, data) {

        /* remove games array from response */
        if (data && data.length > 0) {
            data.forEach(function(item) {
                delete item.games;
            });
        }

        defer.resolve(data || []);
    });

    return defer.promise;
};
