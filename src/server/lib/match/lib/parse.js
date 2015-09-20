var debug = require('debug')('wol:leaderboard');

/* interpret packet and structure match object for easier use */
module.exports = function parse(game, match) {
    /* fail if we're somehow missing players */
    if (!match.players || match.players.length < 1) return;

    /* if we have ra stats normalize packet then carry on  */
    if (game == 'ra' || game == 'am') {
        match = require(global.cwd + '/lib/games/lib/ra').normalize(match);
    }

    match.players.forEach(function(player, i) {
        /* typically Computer */
        if (!player.nam) {
            player.nam = 'computer';
            return;
        }

        /* lowercase all usernames */
        player.name = player.nam = player.nam.toLowerCase();

        /* remove spectators */
        if (player.spc && player.spc > 0) {
            delete match.players[i];
            return;
        }

        player.won = 0;
        player.loss = 0;
        player.discon = 0;

        /* evaluate completions */
        if (player.cmp) {
            switch (player.cmp) {
                case 2:
                    player.loss = 1;
                    player.discon = 1;
                break;

                case 256:
                    player.won = 1;
                break;

                case 512:
                case 528:
                    player.loss = 1;
                break;
            }
        }

        /* remove unused info */
        delete player.ipa; /* could be tunnel or p2p (unreliable) */
        delete player.addr; /* same reason but for ra1 */
        delete player.ser; /* serials are not used on CnCNet */
    });

    // delete match.buffer; /* only used for additional parsing */
    // delete match.client; /* ununsed information about the client */

    return match;
};
