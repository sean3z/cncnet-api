var debug = require('debug')('wol:leaderboard'),
    $db = require('../lib/mongo'),
    gameres = require('../lib/gameres');

exports.buffer = function(req, res, next) {
    $db.get(req.params.game +'_dumps').findOne({idno: parseInt(req.params.gameId)}, function(err, data) {

        if (!data.buffers || data.buffers.length < 1) return res.send(404);

        data.buffers.forEach(function(buffer, index) {
            data.buffers[index] = buffer.buffer.toString('hex');
        });

        res.send(data.buffers);
    });
};

exports.gameres = function(req, res, next) {
    $db.get(req.params.game +'_dumps').findOne({idno: parseInt(req.params.gameId)}, function(err, data) {

        if (!data.buffers || data.buffers.length < 1) return res.send(404);

        data.buffers.forEach(function(buffer, index) {
            data.buffers[index] = gameres.parse(buffer.buffer);
            delete data.buffers[index].buffer;
        });

        res.send(data.buffers);
    });
};

exports.submit = function(req, res, next) {

    if (!req.body) return res.send(400);

    res.send(gameres.parse(req.body));
};
