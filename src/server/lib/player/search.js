var $db = require(global.cwd + '/lib/mongo'),
    $q = require('q'),
    _sanitize = require('./lib/sanitize');

/* method to search for a quick list of players by name */
module.exports = function search(game, player) {
    var defer = $q.defer();
    $db.get(game + '_players').find({name: _sanitize(player, false)}, {limit: 10}, function(err, data) {

        /* remove games array and sensitive data from response */
        if (data && data.length > 0) {
            data.forEach(function(row) {
                delete row.games;
                delete row.username;
                delete row.password;
            });
        }

        defer.resolve(data || []);
    });

    return defer.promise;
};
