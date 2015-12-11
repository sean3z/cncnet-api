var debug = require('debug')('wol:leaderboard');
var clans = require(global.cwd + '/lib/clans');

exports.info = function (req, res, next) {
    res.send(200);
};

exports.create = function (req, res, next) {
    res.send(200);
};

exports.adjust = function (req, res, next) {
    res.send(200);

    switch (req.params.method) {
        case 'join':
            break;

        case 'part':
            break;

        case 'modify':
            break;
    }
};

exports.destroy = function (req, res, next) {
    res.send(200);
};