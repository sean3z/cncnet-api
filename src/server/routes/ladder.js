var match = require('../lib/match'),
    ranking = require('../lib/ranking'),
    player = require('../lib/player'),
    gameres = require('../lib/gameres'),
    debug = require('debug')('wol:leaderboard');

exports.submit = function (req, res, next) {
    /* discontinue if missing request data */
    if (!req.body || !req.params.game) return res.send(400);

    var dump = gameres.parse(req.body) || {};

    /* discontinue if missing gameres data */
    if (!dump.client || !dump.client.nick) return res.send(400);

    res.send(202);
    match.process(req.params.game, dump);
};

exports.ladder = function (req, res, next) {
    ranking.ladder(req.params.game, req.params.limit).then(function(data) {
        if (data && data.length > 0) {
            res.header('Cache-Control', 'public, max-age=60');
        }

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

    if (!req.body || !req.body.player) return _error();
    player.search(req.params.game, req.body.player).then(_success, _error);
};

exports.player = function(req, res, next) {
    var _success = function (data) {
        res.header('Cache-Control', 'public, max-age=30');
        res.send(data);
    };
    var _error = function () {
        res.send(404);
    };

    player.stats(req.params.game, req.params.player, req.params.games).then(_success, _error);
};

exports.match = function(req, res) {
    var _success = function (data) {
        res.header('Cache-Control', 'public, max-age=950400');
        res.send(data);
    };
    var _error = function () {
        res.send(404);
    };

    match.information(req.params.game, parseInt(req.params.gameId)).then(_success, _error);
};
