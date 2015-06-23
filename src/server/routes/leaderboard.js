var match = require('../lib/match');
var ranking = require('../lib/ranking');
var debug = require('debug')('wol:leaderboard');

exports.incoming = function (req, res, next) {
    match.process(req.params.game, req.body);
    res.send(200);
};

exports.rankings = function (req, res, next) {
    ranking.player(req.params.game, 150).then(function(data) {
        res.send(data);
    });
};

exports.match = function(req, res, next) {
    match.information(req.params.game, parseInt(req.params.gameId)).then(_success, _error);
    function _success(data) {
        res.send(data);
    }

    function _error() {
        res.send(404);
    }
};
