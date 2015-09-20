var debug = require('debug')('wol:leaderboard');

/* brings ra1 gameres up to par */
exports.normalize = function(match) {
    (match.players || []).forEach(function(player) {

        /* properties from Iran's RA patch */
        player.cmp = 256;
        if (player.ded) {
            player.cmp = 528;
        } else if (player.rsg) {
            player.cmp = 512;
        } else if (player.con) {
            player.cmp = 2;
        }
    });

    match.settings.plrs = match.players.length;
    delete match.settings.nump;
    debug('ra game, idno: %d normalized!', match.idno);
};
