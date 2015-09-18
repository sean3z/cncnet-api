var $db = require(global.cwd + '/lib/mongo');
var debug = require('debug')('wol:leaderboard');
var Arpad = require('arpad');

module.exports = function(game, match) {
    var elo = new Arpad();
    var $players = $db.get(game +'_players');
    var $games = $db.get(game +'_games');

    if (match.winners[0] && match.losers[0]) {
        $players.find({name: {$in: [match.winners[0].name, match.losers[0].name]}}, function(err, data) {

            if (data && data.length == 2) {
                data.forEach(function(player, index) {
                    var opponent = (index === 0) ? 1 : 0;
                    var myPoints = player.points || 1500;
                    var theirPoints = data[opponent].points || 1500;
                    var points = 0;
                    var gains = {};

                    if (player.name == match.winners[0].name)  {
                        points = elo.newRatingIfWon(myPoints, theirPoints);
                        gains.player = match.winners[0].index;
                        gains.points = points - myPoints;
                    } else {
                        points = elo.newRatingIfLost(myPoints, theirPoints);
                        gains.player = match.losers[0].index;
                        gains.points = myPoints - points;
                    }

                    $players.update({name: player.nam}, {$set: {points: points}, $inc: player.__gains}, {upsert: true});
                    debug('game: %s, idno: %s, player: %s updated', game, match.idno, player.nam);

                    var str = ['players', gains.player, '__gains', 'points'].join('.');
                    var update = {$set: {}};
                    update.$set[str] = gains.points;
                    $games.update({idno: match.idno}, update);
                });
            }
        });
    }
};
