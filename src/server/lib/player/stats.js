var $db = require(global.cwd + '/lib/mongo'),
    $q = require('q'),
    _sanitize = require('./lib/sanitize');

/* this method provides more data that .locate */
module.exports = function stats(game, player) {
    var defer = $q.defer();
    $db.get(game + '_players').findOne({name: _sanitize(player, true)}, function(err, player_data) {
        if (!player_data) return defer.reject();
        player_data.games = player_data.games || [];

        /* remove any sensitive data from response */
        delete player_data.uid;

        if (!player_data.games.length) return defer.resolve(player_data);

        /* left join last 50 games */
        player_data.games = player_data.games.slice(-50);
        $db.get(game + '_games').find({idno: {$in: player_data.games}}, {sort: {date: -1}}, function (err, game_data) {
            if (game_data && game_data.length > 0) {
                game_data.forEach(function (stats, index) {
                    player_data.games[index] = stats;
                });
            }

            /* leaderboard position; todo make more efficient */
            player_data.rank = 0;
            var ladder = global.ladder[game] || [];
            for (var i = 0; i < ladder.length; i++) {
                if (ladder[i].name == player_data.name) {
                    player_data.rank = ladder[i].rank;
                    break;
                }
            }

            defer.resolve(player_data);
        });

    });

    return defer.promise;
};
