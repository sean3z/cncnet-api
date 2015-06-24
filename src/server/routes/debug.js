var debug = require('debug')('wol:leaderboard');
var $db = require('../lib/mongo');
var gameres = require('../lib/gameres');

exports.reset = function(req, res, next) {
    var games = ['ts', 'ra', 'td', 'd2'];
    games.forEach(function(game) {
        $db.get(game +'_dumps').drop();
        $db.get(game +'_games').drop();
        $db.get(game +'_players').drop();
    });

    res.send(200);
};
