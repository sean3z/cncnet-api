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
    $db.get(game + '_players').findOne({name: new RegExp(player, 'i')}, function(err, player_data) {
        $db.get(game + '_games').find({idno: {$in: player_data.games}}, function(err, game_data) {
            $db.get(game + '_ladder').findOne({name: player_data.name}, function(err, rank_data) {
                if (rank_data && rank_data.rank) player_data.rank = rank_data.rank;

                if (game_data.length < 1) defer.resolve(player_data);

                game_data.forEach(function(stats, index) {
                    player_data.games[index] = stats;
                });

                defer.resolve(player_data);
            });
        });
    });

    return defer.promise;
};
