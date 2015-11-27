/*jshint -W004 */
var $db = require(global.cwd + '/lib/mongo'),
    debug = require('debug')('wol:leaderboard'),
    Arpad = require('arpad'),
    $q = require('q'),
    DEFAULT_POINTS = 1000;

module.exports = function singles(game, match, packets) {
    debug('game: %s, idno: %d is singles', game, match.idno);

    /* stop if <> 1v1 */
    if (match.players.length != 2) return;
    packets = packets || [];

    /* find winner and loser */
    var winner = -1,
        loser = -1;

    match.players.forEach(function (player, index) {
        if (player.won > 0) winner = index;
        if (player.loss > 0) loser = index;
    });

    // lower case packet names for further comparison
    packets.forEach(function(packet) {
       if (packet.client) {
           packet.client.nick = (packet.client.nick || '').toLowerCase();
       }
    });

    /* D/C Scenario: 1 packet, no clear winner */
    if (packets[0] && !packets[1] && (winner < 0 || loser < 0)) {
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

    /* D/C Scenario: no clear winner, check if pils or para exists */
    if (packets.length > 1 && (winner < 0 || loser < 0)) {
        if (packets[0].client.pils >= 0 && packets[1].client.pils >= 0) {
            match.players.forEach(function(player, index) {
                loser = index;
                player.discon = 1;
                player.loss = 1;
                player.won = 0;

                /* higher pils means you lost connection */
                if (player.name == packets[0].client.nick) {
                    /* player attempted abort */
                    if (packets[0].client.para > 0) return;

                    if (packets[0].client.pils < packets[1].client.pils) {
                        winner = index;
                        player.discon = 0;
                        player.won = 1;
                        player.loss = 0;
                    }
                } else if (player.name == packets[1].client.nick) {
                    /* player attempted abort */
                    if (packets[1].client.para > 0) return;

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

    /* RA Draw Scenario: both packets.cmpl are 64 */
    if (packets.length > 1 && (game == 'ra' || game == 'am')) {
        if (packets[0].client.cmpl == 64 && packets[1].client.cmpl == 64) {
            loser = -1;
            winner = 1;
            match.players.forEach(function(player) {
                player.won = 1;
                player.loss = 0;
                player.discon = 0;
            });
        }
    }

    var elo = new Arpad(),
        $players = $db.get(game + '_players');

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
                winner = -1;
                loser = -1;
            }
        });

        /* if packet completion status doesn't match up, consider it oos */
        if (packets.length > 1) {
            var player1 = (packets[0].players[0].cmp == packets[1].players[0].cmp);
            var player2 = (packets[0].players[1].cmp == packets[1].players[1].cmp);
            if (!player1 || !player2) {
                update.$set.oosy = 1;
                winner = -1;
                loser = -1;
            }
        }

        match.players.forEach(function (player, index) {
            /* increase out of sync stats for player */
            if (update.$set.oosy) {
                player.oos = 1;
                player.won = 0;
                player.loss = 0;
                player.discon = 0;
            }

            /* query to update player obj */
            var _player = {
                $push: {games: match.idno},
                $inc: {
                    wins: player.won || 0,
                    losses: player.loss || 0,
                    disconnects: player.discon || 0,
                    oos: player.oos || 0
                },
                $set: {
                    points: player.points || DEFAULT_POINTS,
                    activity: Math.floor(Date.now() / 1000)
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
                _player.$set.points = player.exp;

                /* update player, experience gained/loss in match object */
                var str = ['players', index].join('.');
                update.$set[str + '.exp'] = Math.abs(player.points - player.exp);
                update.$set[str + '.points'] = player.points || DEFAULT_POINTS;
            }

            /* update win/loss/discon in game object just in case it's changed */
            var str = ['players', index].join('.');
            update.$set[str + '.won'] = player.won;
            update.$set[str + '.loss'] = player.loss;
            update.$set[str + '.discon'] = player.discon;

            /* update or create player */
            $players.update({name: player.name}, _player, {upsert: true}).error(function(err) {
                console.log('ranking/singles player update error');
                console.log('game: %s, match: %d, player: %s', game, match.idno, player.name);
                console.dir(_player);
                console.dir(err);
            });
        });

        /* update match object */
        $db.get(game + '_games').update({idno: match.idno}, update).error(function(err) {
            console.log('ranking/singles game update error');
            console.log('game: %s, match: %d', game, match.idno);
            console.dir(update);
            console.dir(err);
        });
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

            players[key].points = DEFAULT_POINTS;

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
