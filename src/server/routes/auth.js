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

    if (!credentials.name || !credentials.pass)
    {
        console.log(credentials);
        console.log("No Email or Password in Auth Request");
        return _error();
    } 

    /* name = email */
    player.auth(credentials.name, credentials.pass, nick).then(_success, _error);
};

exports.hof = function(req, res, next) {
    /* reset request has to match server password */
    if (req.params.pw !== global.WOL_ADMIN) return res.send(401);
    next();
};