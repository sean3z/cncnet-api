var auth = require('basic-auth'),
    player = require('../lib/player');

exports.player = function(req, res, next) {
    res.send(req.player || 200);
};

exports.required = function(req, res, next) {
    var credentials = auth(req) || {};
    var params = req.params || {};
    var body = req.body || {};
    var nick = params.player || body.player;

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    var _success = function(data) {
        req.player = data;
        next();
    };

    var _error = function() {
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="CnCNet 5 Leaderboard (Player Auth)"'
        });

        res.end();
    };

    if (!credentials.name || !credentials.pass) return _error();
    player.auth(nick, credentials.name, credentials.pass).then(_success, _error);
};