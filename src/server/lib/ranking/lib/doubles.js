/*jshint -W004 */
var $db = require(global.cwd + '/lib/mongo'),
    debug = require('debug')('wol:leaderboard'),
    Arpad = require('arpad');

modules.export = function doubles(game, match, packets) {
  debug('game: %s, idno: %d is doubles', game, match.idno);

  /* jshint ignore:start */
  return; /* TODO: finialize */
  /* jshint ignore:end */

  /* stop if <> 2v2 */
  if (match.players.length != 4) return;
  packets = packets || [];

  // lower case packet names for further comparison
  packets.forEach(function(packet) {
     if (packet.client) {
         packet.client.nick = (packet.client.nick || '').toLowerCase();
     }
  });

  /* get points for all players */
  points(game, match.players).then(function (players) {
    /* reassign modified players */
    match.players = players;

    /* query to update match obj */
    var update = {$set: {}};

    /* note the type of match */
    update.$set.type = 'doubles';
  });
};