var debug = require('debug')('wol:leaderboard');
var auth = require('basic-auth');
var clans = require(global.cwd + '/lib/clans');
var player = require(global.cwd + '/lib/player');

exports.info = function (req, res) {
    if (!req.params.clan) return res.send(400);

    var _success = function(data) {
        res.send(data);
    };

    var _error = function() {
        res.send(404);
    };

    clans.info(req.params.game, req.params.clan).then(_success, _error);
};

exports.create = function (req, res, next) {
    var credentials = auth(req) || {};

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    /* discontinue if missing request data */
    if (!req.params.clan || !req.body.player) return res.send(400);

    var _success = function() {
        var __success = function() {
            res.send(200);
        };

        var __error = function() {
            res.send(400);
        };

        clans.create(req.params.game, req.params.clan, req.body.player).then(__success, __error);
    };

    var _error = function() {
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="CnCNet 5 Leaderboard (Player Auth)"'
        });

        res.end();
    };

    if (!credentials.name || !credentials.pass) return _error();
    player.auth(req.body.player, credentials.name, credentials.pass).then(_success, _error);
};

exports.adjust = function (req, res) {
    var credentials = auth(req) || {};

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    var _success = function() {
        switch (req.params.method) {
            case 'join':
                break;

            case 'part':
                break;

            case 'modify':
                break;
        }
    };

    var _error = function() {
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="CnCNet 5 Leaderboard (Player Auth)"'
        });

        res.end();
    };

    if (!credentials.name || !credentials.pass) return _error();
    player.auth(req.params.player, credentials.name, credentials.pass).then(_success, _error);
};

exports.destroy = function (req, res) {
    var credentials = auth(req) || {};

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    /* discontinue if missing request data */
    if (!req.params.clan || !req.params.player) return res.send(400);

    var _success = function() {
        var __success = function() {
            res.send(200);
        };

        var __error = function() {
            res.send(400);
        };

        clans.destroy(req.params.game, req.params.clan, req.params.player).then(__success, __error);
    };

    var _error = function() {
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="CnCNet 5 Leaderboard (Player Auth)"'
        });

        res.end();
    };

    if (!credentials.name || !credentials.pass) return _error();
    player.auth(req.params.player, credentials.name, credentials.pass).then(_success, _error);
};