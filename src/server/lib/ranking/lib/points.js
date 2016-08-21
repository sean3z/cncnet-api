/*jshint -W004 */
var $db = require(global.cwd + '/lib/mongo'),
    debug = require('debug')('wol:leaderboard'),
    $q = require('q');

module.exports = {
    points: points
};

function points(game, players) {
    var deferred = $q.defer();

    var search = [];
    players.forEach(function (player) {
        search.push(player.name);
    });

    $db.get(game + '_players').find({name: {$in: search}}, function (err, data) {
        players.forEach(function (player, key) {

            players[key].points = global.DEFAULT_POINTS;

            data.forEach(function (row) {
                if (row.points && player.name == row.name) {
                    players[key].points = row.points;
                }
            });
        });

        deferred.resolve(players);
    });

    return deferred.promise;
}