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
    var _success = function (data) {
        res.send(data);
    };
    var _error = function () {
        res.send(404);
    };

    if (!req.body.player) return _error();
    player.search(req.params.game, req.body.player).then(_success, _error);
};

exports.player = function(req, res, next) {
    var _success = function (data) {
        res.send(data);
    };
    var _error = function () {
        res.send(404);
    };

    player.stats(req.params.game, req.params.player).then(_success, _error);
};

exports.match = function(req, res, next) {
    var _success = function (data) {
        res.send(data);
    };
    var _error = function () {
        res.send(404);
    };
    match.information(req.params.game, parseInt(req.params.gameId)).then(_success, _error);
};
