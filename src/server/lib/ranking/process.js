var debug = require('debug')('wol:leaderboard');

module.exports = function process(game, match) {
    /* handle elo only for singles games */
    if (match.players.length == 2) {
        debug('game: %s, idno: %d is singles', game, match.idno);
        require('./lib/singles')(game, match);
    }
};
