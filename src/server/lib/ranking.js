var $db = require('./mongo');
var debug = require('debug')('wol:leaderboard');
var Arpad = require('arpad');

exports.process = function(game, match) {
    var elo = new Arpad();
    var $players = $db.get(game +'_players');
    var $games = $db.get(game +'_games');
    /* handle elo only for 1v1 games */
    if (match.players.length == 2) {
        debug('game: %s, idno: %d is 1v1', game, match.idno);
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

                        $players.update({_id: player._id}, {$set: {points: points}});
                        var str = ['players', gains.player, '__gains', 'points'].join('.');
                        var update = {$set: {}};
                        update.$set[str] = gains.points;
                        $games.update({idno: match.idno}, update)
                    });
                }
            });
        }
    }
};
