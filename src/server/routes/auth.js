var auth = require('basic-auth'),
    player = require('../lib/player');

exports.player = function(req, res, next) {
    var credentials = auth(req) || {};

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    var _success = function(data) {
        res.send(data || 200);
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

exports.required = function(req, res, next) {
    var credentials = auth(req) || {};
    req.params = req.params || {};
    req.body = req.body || {};
    var nick = req.params.player || req.body.player;

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    var _error = function() {
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="CnCNet 5 Leaderboard (Player Auth)"'
        });

        res.end();
    };

    if (!credentials.name || !credentials.pass) return _error();
    player.auth(nick || credentials.name, credentials.name, credentials.pass).then(next, _error);
};