/*jshint -W004 */
var $db = require(global.cwd + '/lib/mongo'),
    debug = require('debug')('wol:leaderboard');

module.exports = {
    points: points
};

function points(game, players) {
    return new Promise(function(resolve, reject) {
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

            return resolve(players);
        });
    });
}