var gameId = require('./lib/gameId');

module.exports = {
    supported: [
        'td',
        'd2',
        'ra',
        'am',
        'ts',  /* ts: ww maps */
        'tsm', /* ts: mod maps */
        'fs',
        'dta',
        'ra2',
        'yr'
    ],
    gameId: {
        reserve: gameId.reserve
    }
};
