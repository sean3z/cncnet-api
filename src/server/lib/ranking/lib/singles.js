/*jshint -W004 */
var $db = require(global.cwd + '/lib/mongo');
var debug = require('debug')('wol:leaderboard');
var parse = require(global.cwd + '/lib/match/lib/parse');
var Arpad = require('arpad');
var $q = require('q');

module.exports = function singles(game, match, packets) {
    /* stop if <> 1v1 */
    if (match.players.length != 2) return;
    packets = packets || [];

    /* find winner and loser */
    var winner = -1;
    var loser = -1;

    match.players.forEach(function (player, index) {
        if (player.won > 0) winner = index;
        if (player.loss > 0) loser = index;
    });

    /* D/C Scenario: 1 packet, both marked as loser */
    if (packets[0] && !packets[1] && winner < 0 && loser >= 0) {
        match.players.forEach(function(player, index) {
            loser = index;
            player.discon = 1;
            player.loss = 1;
            player.won = 0;

            /* assume uploader won */
            if (player.name == packets[0].client.nick) {
                winner = index;
                player.discon = 0;
                player.won = 1;
                player.loss = 0;
            }
        });
    }

    /* D/C Scenario: both still marked as loser, check if pils exists */
    if (packets.length > 1 && winner < 0 && loser >= 0) {
        if (packets[0].client.pils && packets[1].client.pils) {
            match.players.forEach(function(player, index) {
                loser = index;
                player.discon = 1;
                player.loss = 1;
                player.won = 0;

                /* higher pils means you lost connection */
                if (player.name == packets[0].client.nick) {
                    if (packets[0].client.pils < packets[1].client.pils) {
                        winner = index;
                        player.discon = 0;
                        player.won = 1;
                        player.loss = 0;
                    }
                } else if (player.name == packets[1].client.nick) {
                    if (packets[1].client.pils < packets[0].client.pils) {
                        winner = index;
                        player.discon = 0;
                        player.won = 1;
                        player.loss = 0;
                    }
                }
            });
        }
    }

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

        /* determine if game is out of sync */
        packets.forEach(function(packet) {
            if (packet.client.oosy) {
                update.$set.oosy = 1;
            }
        });

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

            /* calculate points if winner and loser */
            if (winner >= 0 && loser >= 0) {
                var opponent = match.players[loser];
                var method = 'newRatingIfWon';

                if (player.loss > 0) {
                    opponent = match.players[winner];
                    method = 'newRatingIfLost';
                }

                /* calculate new point value */
                player.exp = elo[method](player.points, opponent.points);
            }

            /* if we only have losers, deduct from both players */
            else if (winner < 0 && loser >= 0) {
                /* deduct 0.7% percent of points (higher points, d/c hits harder) */
                player.exp = player.points - Math.floor((0.7 / 100) * player.points);
            }

            /* if we have points, update the game and player records */
            if (player.exp) {
                /* update _player points */
                _player.$set = {points: player.exp};

                /* update player, experience gained/loss in match object */
                var str = ['players', index, 'exp'].join('.');
                update.$set[str] = Math.abs(player.points - player.exp);
            }

            /* update win/loss/discon in game object just in case it's changed */
            var str = ['players', index].join('.');
            update.$set[str + '.won'] = player.won;
            update.$set[str + '.loss'] = player.loss;
            update.$set[str + '.discon'] = player.discon;

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
