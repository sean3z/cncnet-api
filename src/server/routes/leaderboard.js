//var packet = require('./lib/packet');
var match = require('../lib/match');
var debug = require('debug')('wol:leaderboard');
var $db = require('../lib/mongo');

exports.match = function (req, res, next) {
    // debug('WOL Gameres packet recieved');
    match.process(req.params.game, req.body);
    res.status(200);
};

exports.rankings = function (req, res, next) {
    $db.get(req.params.game + '_players').find({}, {sort: {points: -1}}, function(err, data) {
        res.send(data);
    });
};
