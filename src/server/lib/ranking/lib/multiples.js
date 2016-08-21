/*jshint -W004 */
var $db = require(global.cwd + '/lib/mongo'),
    debug = require('debug')('wol:leaderboard'),
    Arpad = require('arpad');

modules.export = function multiples(game, match, packets) {
  debug('game: %s, idno: %d is multiples', game, match.idno);

  /* stop if <= 1v1 */
  if (match.players.length < 3) return;
  packets = packets || [];

  // lower case packet names for further comparison
  packets.forEach(function(packet) {
     if (packet.client) {
         packet.client.nick = (packet.client.nick || '').toLowerCase();
     }
  });

  /* get points for all players */
  points(game, match.players).then(function (players) {
  });
};