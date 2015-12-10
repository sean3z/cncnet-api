var debug = require('debug')('wol:leaderboard');

/* brings td gameres up to par */
exports.normalize = function(match) {
    var client = match.client || {};

    /**
     * CMPL -> Game Result (for this client), with the following possible results (taken from C&C95):
     * 64 = game is draw
     * 6 = player 1 disconnect (also when player aborts in options menu in game)
     * 5 = player 1 resigned (doesn't seem to be used, when player resigns the 'lost' value is used)
     * 4 = player 1 lost
     * 3 = player 2 disconnect  (also when player aborts in options menu in game)
     * 2 = player 2 resigned (doesn't seem to be used, when player resigns the 'lost' value is used)
     * 1 = player 2 lost
     * 0 = connection lost
     * -1 (0xFF) = Host left?
     */

    /* cmpl only works for 1v1 */
    if (match.players.length == 2 && client.cmpl) {
        switch(client.cmpl) {
            case 6:
                match.players[0].cmp = 2;
                match.players[1].cmp = 256;
            break;

            case 5:
                match.players[0].cmp = 512;
                match.players[1].cmp = 256;
            break;

            case 4:
                match.players[0].cmp = 528;
                match.players[1].cmp = 256;
            break;

            case 3:
                match.players[0].cmp = 256;
                match.players[1].cmp = 2;
            break;

            case 2:
                match.players[0].cmp = 256;
                match.players[1].cmp = 512;
            break;

            case 1:
                match.players[0].cmp = 256;
                match.players[1].cmp = 528;
            break;
        }
    }

    match.settings.plrs = match.players.length;

    debug('game: td, idno: %d stats normalized!', match.idno);

    return match;
};
