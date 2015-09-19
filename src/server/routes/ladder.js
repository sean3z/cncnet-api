var match = require('../lib/match');
var ranking = require('../lib/ranking');
var player = require('../lib/player');
var debug = require('debug')('wol:leaderboard');

exports.submit = function (req, res, next) {
    res.send(202);
    match.process(req.params.game, req.body);
};

exports.ladder = function (req, res, next) {
    ranking.ladder(req.params.game, 150).then(function(data) {
        res.send(data);
    });
};

exports.search = function (req, res, next) {
    if (!req.body.player) return _error();
    player.search(req.params.game, req.body.player).then(res.send, _error);

    var _error = function () {
        res.send(404);
    };
};

exports.player = function(req, res, next) {
    if (!req.params.player) return _error();
    player.stats(req.params.game, req.params.player).then(res.send, _error);

    var _error = function () {
        res.send(404);
    };
};

exports.match = function(req, res, next) {
    if (!req.params.gameId) return _error();
    match.information(req.params.game, parseInt(req.params.gameId)).then(res.send, _error);

    var _error = function () {
        res.send(404);
    };
};
