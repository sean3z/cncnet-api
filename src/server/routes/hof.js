var debug = require('debug')('wol:leaderboard');
var $db = require('../lib/mongo');
var games = require('../lib/games');

exports.list = function(req, res, next) {
  var search = {};
  var fields = '';

  if (req.params.month) {
    search.month = parseInt(req.params.month);
  }

  if (req.params.year) {
    search.year = parseInt(req.params.year);
  }

  if (req.params.game) {
    search[req.params.game] = {$exists: true};
    fields = 'month year ' + req.params.game;
  }

  $db.get('hof').find(search, fields, function(err, data) {
    res.send(data);
  });
};

exports.snapshot = function(req, res, next) {
    res.send(200);

    /* reset request has to match server password */
    if (req.params.pw !== global.WOL_ADMIN) return;

    var date = new Date();
    var hof = {
        month: date.getMonth(),
        year: date.getFullYear()
    };

    games.supported.forEach(function(game) {
        hof[game] = [];
        if (global.ladder[game]) {
            hof[game] = global.ladder[game].slice(0, 10);
        }

        var reset = {
            $set: {
                points: global.DEFAULT_POINTS,
                games: [],
                wins: 0,
                losses: 0,
                disconnects: 0,
                oos: 0
            }
        };

        $db.get(game +'_players').update({}, reset, {multi: true});
        $db.get(game +'_clans').update({}, reset, {multi: true});
    });

    global.ladder = {};

    /* cleanup HoF */
    games.supported.forEach(function(game) {
        // @TODO if hof[game].length < 10 or each player doesn't
        // have at least 1 win; remove from hof[game]
        if (hof[game].length) {
            hof[game].forEach(function(player, index) {
                $db.get(game +'_players').update({name: player.name}, {
                    $push: {
                        hof: {
                            month: hof.month,
                            year: hof.year,
                            rank: index + 1
                        }
                    }
                });
            });
        }
    });

    $db.get('hof').insert(hof);
};