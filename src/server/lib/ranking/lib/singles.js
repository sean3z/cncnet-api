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

    match.players.forEach(function(player, index) {
        if (player.won > 0) winner = index;
        if (player.loss > 0) loser = index;
    });

    /* discontinue if no winner /and/ loser */
    if (winner < 0 || loser < 0) return;

    var elo = new Arpad();
    var $players = $db.get(game +'_players');

    /* get points for players */
    points(game, match.players).then(function(players) {
        match.players = players; /* reassign modified players */
        var update = {$set: {}}; /* query to update match obj */

        /* note the type of match */
        update.$set.type = 'singles';

        match.players.forEach(function(player, index) {
            var opponent = match.players[loser];
            var method = 'newRatingIfWon';

            if (player.loss > 0) {
                opponent = match.players[winner];
                method = 'newRatingIfLost';
            }

            /* calculate new point value */
            player.exp = elo[method](player.points, opponent.points);

            /* update or create player */
            $players.update({name: player.name}, {
                $set: {points: player.exp},
                $push: {games: match.idno},
                $inc: {
                    wins: player.won,
                    losses: player.loss,
                    disconnects: player.discon
                }
            }, {upsert: true});

            /* update player in match object */
            var str = ['players', index, 'exp'].join('.');
            update.$set[str] = Math.abs(player.points - player.exp);
        });

        /* update match object */
        $db.get(game +'_games').update({idno: match.idno}, update);
    });
};

function points(game, players) {
    var deferred = $q.defer();

    var search = [];
    players.forEach(function(player) {
       search.push(player.name);
    });

    $db.get(game +'_players').find({name: {$in: search}}, function(err, data) {
        players.forEach(function(player) {
            players[player].points = 1000;

            data.forEach(function(row) {
                if (row.points && player.name == row.name) {
                    players[player].points = row.points;
                }
            });
        });

        deferred.resolve(players);
    });

    return deferred.promise;
}
