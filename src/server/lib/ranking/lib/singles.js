var $db = require(global.cwd + '/lib/mongo');
var debug = require('debug')('wol:leaderboard');
var Arpad = require('arpad');
var $q = require('q');

module.exports = function singles(game, match) {
    /* stop if <> 1v1 */
    if (match.players.length != 2) return;

    /* find winner and loser */
    var winner = -1;
    var loser = -1;

    match.players.forEach(function (player, index) {
        if (player.won > 0) winner = index;
        if (player.loss > 0) loser = index;
    });

    var elo = new Arpad();
    var $players = $db.get(game + '_players');

    /* get points for players */
    points(game, match.players).then(function (players) {
        /* reassign modified players */
        match.players = players;

        /* query to update match obj */
        var update = {$set: {}};

        /* note the type of match */
        update.$set.type = 'singles';

        match.players.forEach(function (player, index) {
            /* query to update player obj */
            var _player = {
                $push: {games: match.idno},
                $inc: {
                    wins: player.won,
                    losses: player.loss,
                    disconnects: player.discon
                }
            };

            /* only calculate points if winner and loser */
            if (winner >= 0 && loser >= 0) {
                var opponent = match.players[loser];
                var method = 'newRatingIfWon';

                if (player.loss > 0) {
                    opponent = match.players[winner];
                    method = 'newRatingIfLost';
                }

                /* calculate new point value */
                player.exp = elo[method](player.points, opponent.points);

                /* update _player points */
                _player.$set = {points: player.exp};

                /* update player, experience gained/loss in match object */
                var str = ['players', index, 'exp'].join('.');
                update.$set[str] = Math.abs(player.points - player.exp);
            }

            /* update or create player */
            $players.update({name: player.name}, _player, {upsert: true});
        });

        /* update match object */
        $db.get(game + '_games').update({idno: match.idno}, update);
    });
};

function points(game, players) {
    var deferred = $q.defer();

    var search = [];
    players.forEach(function (player) {
        search.push(player.name);
    });

    $db.get(game + '_players').find({name: {$in: search}}, function (err, data) {
        players.forEach(function (player, key) {

            players[key].points = 1000;

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
