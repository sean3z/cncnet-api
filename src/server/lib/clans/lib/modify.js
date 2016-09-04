var debug = require('debug')('wol:leaderboard');
var $db = require(global.cwd + '/lib/mongo');
var _sanitize = require(global.cwd + '/lib/player/lib/sanitize');

module.exports = function modify(game, clan, options) {
    var player = (options.player || '').toLowerCase();
    delete options.player;

    var $clans = $db.get(game +'_clans');

    return new Promise(function(resolve, reject) {
        $clans.findOne({name: _sanitize(clan, true)}, function(err, clan_data) {
            if (!clan_data) return reject();

            // ensure player is founder of clan
            if (clan_data.founder !== player) return reject();

            // disallow certain changes
            delete options.name;
            delete options.nam;
            delete options.created;
            delete options.points;
            delete options.games;
            delete options.members;
            delete options.founder;

            // TODO: allow clan founders to kick members
            // TODO: allow clan founder to change founder

            $clans.update({name: _sanitize(clan, true)}, {
                $set: options
            });

            return resolve();
        });
    });
};