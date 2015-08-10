var debug = require('debug')('wol:leaderboard');
var $db = require('../lib/mongo');
var gameres = require('../lib/gameres');

exports.reset = function(req, res, next) {
    var games = ['ts', 'ra', 'td', 'd2', 'am'];
    games.forEach(function(game) {
        $db.get(game +'_dumps').drop();
        $db.get(game +'_games').drop();
        $db.get(game +'_players').drop();
        $db.get(game +'_ladder').drop();
    });

    res.send(200);
};

exports.buffer = function(req, res, next) {
    $db.get(req.params.game +'_dumps').findOne({idno: parseInt(req.params.gameId)}, function(err, data) {
        res.send(data.buffers[0].buffer.toString('hex'));
    });
};

exports.gameres = function(req, res, next) {
    $db.get(req.params.game +'_dumps').findOne({idno: parseInt(req.params.gameId)}, function(err, data) {
        res.send(gameres.parse(data.buffers[0].buffer));
    });
};

exports.submit = function(req, res, next) {
    res.send(gameres.parse(req.body));
};
