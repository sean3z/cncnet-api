var match = require('../lib/match');
var ladder = require('../lib/ladder');
var player = require('../lib/player');
var debug = require('debug')('wol:leaderboard');

exports.submit = function (req, res, next) {
    match.process(req.params.game, req.body);
    res.send(200);
};

exports.ladder = function (req, res, next) {
    ladder.player(req.params.game, 150).then(function(data) {
        res.send(data);
    });
};

exports.search = function (req, res, next) {
    if (req.body.player) {
        player.locate(req.params.game, req.body.player).then(function(data) {
            res.send(data);
        });
    }
};

exports.player = function(req, res, next) {
    if (req.params.player) {
        player.stats(req.params.game, req.params.player).then(_success, _error);
        function _success(data) {
            res.send(data);
        }

        function _error() {
            res.send(404);
        }
    }
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
