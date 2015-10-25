var auth = require('basic-auth');
var player = require('../lib/player');

exports.player = function(req, res, next) {
    var credentials = auth(req) || {};

    var _success = function() {
        res.send(200);
    };

    var _error = function() {
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="CnCNet 5 Leaderboard"'
        });

        res.end();
    };

    if (!credentials.name || !credentials.pass) return _error();
    player.auth(req.params.player, credentials.name, credentials.pass).then(_success, _error);
};

exports.create = function(req, res, next) {
    res.send(503);
};
