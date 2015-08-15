var $db = require('./mongo');
var $q = require('q');

/* method to search for a quick list of players by name */
exports.locate = function(game, search) {
    var defer = $q.defer();
    $db.get(game + '_players').find({name: _sanitize(search)}, {limit: 10}, function(err, data) {
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

/* this method provides more data that .locate */
exports.stats = function(game, player) {
    var defer = $q.defer();
    $db.get(game + '_players').findOne({name: _sanitize(player)}, function(err, player_data) {
        if (!player_data) return defer.reject();

        /* left join last 50 games */
        player_data.games = player_data.games.slice(-50);
        $db.get(game + '_games').find({idno: {$in: player_data.games}}, function(err, game_data) {
            if (game_data && game_data.length > 0) {
                game_data.forEach(function(stats, index) {
                    player_data.games[index] = stats;
                });
            }

            /* leaderboard position */
            $db.get(game + '_ladder').findOne({name: player_data.name}, function(err, rank_data) {
                player_data.rank = 0;
                if (rank_data && rank_data.rank) {
                    player_data.rank = rank_data.rank;
                }
                defer.resolve(player_data);
            });
        });
    });

    return defer.promise;
};

function _sanitize(str) {
    return new RegExp(str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
}
