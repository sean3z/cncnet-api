var debug = require('debug')('wol:leaderboard');

/* brings ra1 gameres up to par */
exports.normalize = function(match) {
    var client = match.client || {};

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

        /* property hack from Funky's RA client */
        if (client.nick == player.name && client.sdfx) {
            player.cmp = 2;
        }

        /* if cmpl = 255, player disconnected */
        if (client.cmpl && client.cmpl == 255) {
            player.cmp = 2;
        }
    });

    match.settings.plrs = match.players.length;
    delete match.settings.nump;

    debug('ra game, idno: %d normalized!', match.idno);

    return match;
};
