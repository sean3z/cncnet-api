var debug = require('debug')('wol:leaderboard');
var clans = require(global.cwd + '/lib/clans');

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
    /* discontinue if missing request data */
    if (!req.params.clan || !req.body.player) return res.send(400);

    var _success = function() {
        res.send(200);
    };

    var _error = function() {
        res.send(400);
    };

    clans.create(req.params.game, req.params.clan, req.body.player).then(_success, _error);
};

exports.adjust = function (req, res) {
    var method = req.body.method;

    /* discontinue if missing request data */
    if (!req.params.clan || !method) return res.send(400);

    /* discontinue if method isn't supported */
    var methods = ['join', 'part', 'modify'];
    if (methods.indexOf(method) < 0) return res.send(400);

    var _success = function() {
        res.send(200);
    };

    var _error = function() {
        res.send(400);
    };

    delete req.body.method;
    clans[method](req.params.game, req.params.clan, req.body).then(_success, _error);
};

exports.destroy = function (req, res) {
    if (!req.params.clan) return res.send(400);

    var _success = function() {
        res.send(200);
    };

    var _error = function() {
        res.send(400);
    };

    clans.destroy(req.params.game, req.params.clan, req.params.player).then(_success, _error);
};