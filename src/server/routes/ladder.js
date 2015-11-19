var match = require('../lib/match'),
    ranking = require('../lib/ranking'),
    player = require('../lib/player'),
    gameres = require('../lib/gameres'),
    auth = require('basic-auth'),
    debug = require('debug')('wol:leaderboard');

/* match cache for quick comparison */
global.matches = {};

exports.submit = function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    /* discontinue if missing request data */
    if (!req.body || !req.params.game) return res.send(400);

    var credentials = auth(req) || {},
        dump = gameres.parse(req.body) || {};

    global.matches[dump.idno] = global.matches[dump.idno] || [];

    /* discontinue if missing gameres data */
    if (!dump.client || !dump.client.nick) return res.send(400);

    /* discontinue if same player detected in match */
    if (global.matches[dump.idno].length) {
        for (var i = 0, x = global.matches[dump.idno].length; i < x; i++) {
            var row = global.matches[dump.idno][i];
            if (dump.client.unid == row.unid) return;
        }
    }

    var _success = function() {
        res.send(202);

        global.matches[dump.idno].push({
            unid: dump.client.unid
        });

        if (global.matches[dump.idno].length < 2) {
            match.process(req.params.game, dump);
        }
    };

    var _error = function() {
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="CnCNet 5 Leaderboard"'
        });

        res.end();
    };

    if (!credentials.name || !credentials.pass) return _error();
    player.auth(dump.client.nick, credentials.name, credentials.pass).then(_success, _error);
};

exports.ladder = function (req, res, next) {
    ranking.ladder(req.params.game, (req.params.limit || 150)).then(function(data) {
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
