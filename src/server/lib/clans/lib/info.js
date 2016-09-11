var debug = require('debug')('wol:leaderboard');
var $db = require(global.cwd + '/lib/mongo');
var _sanitize = require(global.cwd + '/lib/player/lib/sanitize');

module.exports = function info(game, clan) {
  return new Promise(function(resolve, reject) {
    $db.get(game + '_clans').findOne({name: _sanitize(clan, true)}, function(err, data) {
        if (!data) return reject();

        // hide sensitive info
        delete data.password;

        resolve(data);
    });
  });
};