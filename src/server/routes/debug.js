var debug = require('debug')('wol:leaderboard'),
    $db = require('../lib/mongo'),
    gameres = require('../lib/gameres'),
    games = require('../lib/games');

exports.reset = function(req, res, next) {
    games.supported.forEach(function(game) {
        var reset = {
            $set: {
                points: 0,
                games: [],
                wins: 0,
                losses: 0,
                disconnects: 0,
                oos: 0
            }
        };

        $db.get(game +'_players').update({}, reset, {multi: true});
    });

    global.ladder = {};

    res.send(200);
};

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

    if (!res.body) return res.send(401);

    res.send(gameres.parse(req.body));
};
