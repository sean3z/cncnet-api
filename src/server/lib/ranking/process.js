var debug = require('debug')('wol:leaderboard');

exports.process = function(game, match) {
    /* handle elo only for singles games */
    if (match.players.length == 2) {
        debug('game: %s, idno: %d is singles', game, match.idno);
        require('./lib/singles')(game, match);
    }
};
