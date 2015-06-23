var match = require('../lib/match');
var ranking = require('../lib/ranking');
var debug = require('debug')('wol:leaderboard');
var $db = require('../lib/mongo');

exports.match = function (req, res, next) {
    match.process(req.params.game, req.body);
    res.send(200);
};

exports.rankings = function (req, res, next) {
    ranking.player(req.params.game, 150).then(function(data) {
        res.send(data);
    });
};
