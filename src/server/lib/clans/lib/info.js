var debug = require('debug')('wol:leaderboard');
var $db = require(global.cwd + '/lib/mongo');
var _sanitize = require(global.cwd + '/lib/player/lib/sanitize');
var $q = require('q');

module.exports = function info(game, clan) {
    var defer = $q.defer();

    $db.get(game + '_clans').findOne({name: _sanitize(clan, true)}, function(err, data) {
        if (!data) return defer.reject();

        // hide sensitive info
        delete data.password;

        defer.resolve(data);
    });

    return defer.promise;
};