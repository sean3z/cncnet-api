/*jshint -W004 */
var $db = require(global.cwd + '/lib/mongo'),
    debug = require('debug')('wol:leaderboard'),
    Arpad = require('arpad'),
    points = require('./points').points;

modules.export = function clans(game, match, packets) {
  debug('game: %s, idno: %d is clans', game, match.idno);

  /* jshint ignore:start */
  return; /* TODO: finialize */
  /* jshint ignore:end */

  /* stop if 1v1 */
  if (match.players.length < 4) return;
  packets = packets || [];

  // lower case packet names for further comparison
  packets.forEach(function(packet) {
     if (packet.client) {
         packet.client.nick = (packet.client.nick || '').toLowerCase();
     }
  });

  /* get clans for all players */
  clans(game, match.players).then(function (players, clans) {
    if (clans.length !== 2) return; /* need exactly two clans */

    /* ensure that every player is in a clan */


    /* reassign modified players */
    match.players = players;

    /* query to update match obj */
    var update = {$set: {}};

    /* note the type of match */
    update.$set.type = 'clans';
  });
};


function clans(game, players) {
  return new Promise(function(resolve, reject) {
    
    var search = [];
    players.forEach(function (player) {
        search.push(player.name);
    });

    $db.get(game + '_players').find({name: {$in: search}}, function (err, data) {
        players.forEach(function (player, key) {

            var clans = [];
            data.forEach(function (row) {
                if (row.clan && player.name == row.name) {
                    players[key].clan = row.clan;
                    clans.push(row.clan);
                }
            });

            $db.get(game + '_clans').find({name: {$in: clans}}, function(err, data) {
                clans.forEach(function(clan, index) {
                    data.forEach(function(row) {
                        if (row.name && clan == row.name) {
                            
                        }
                    });

                });
                

                return resolve(players, clans);
            });
        });
    });


    $db.get(game + '_clans').find(query, function(err, data) {

    resolve(players, clans);
  });
}