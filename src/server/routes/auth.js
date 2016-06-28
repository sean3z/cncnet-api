var auth = require('basic-auth'),
    player = require('../lib/player');

exports.player = function(req, res, next) {
    var credentials = auth(req) || {};

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    /* discontinue if missing request data */
    if (!req.params.player) return res.send(400);

    var _success = function() {
        res.send(200);
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