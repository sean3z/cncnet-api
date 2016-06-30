/* consolidate player stats */
module.exports = function _consolidate(flat) {
    var consolidated = {players: [], settings: {}, client: {}},
        settings = require('./lib/settings'),
        client = require('./lib/client');

    if (flat.NAM0 || flat.NAM1) {
        for (var item in flat) {
            var value = flat[item],
                key = item.toLowerCase(),
                index = parseInt(key.slice(-1));

            /* player stats */
            if (index > -1) {
                if (!consolidated.players[index]) consolidated.players[index] = {};
                consolidated.players[index][key.slice(0, -1)] = value;
                continue;
            }

            /* game settings */
            if (settings.indexOf(key) > -1) {
                consolidated.settings[key] = value;
                continue;
            }

            /* client settings */
            if (client.indexOf(key) > -1) {
                consolidated.client[key] = value;
                continue;
            }

            consolidated[key] = value;
        }
    }

    /* players[0] is sometimes undefined? h4x */
    if (consolidated.players[0] === undefined) {
        consolidated.players.shift();
    }

    /* use MYID field if we can't determine who sent packet */
    if (!consolidated.client.nick && consolidated.client.myid >= 0) {
        var player = consolidated.players[consolidated.client.myid];
        consolidated.client.nick = player.nam;
    }


    /* overwrite date */
    consolidated.date = Math.floor(Date.now() / 1000);

    return consolidated;
};
