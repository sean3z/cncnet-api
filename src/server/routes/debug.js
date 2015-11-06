var debug = require('debug')('wol:leaderboard'),
    $db = require('../lib/mongo'),
    gameres = require('../lib/gameres'),
    games = require('../lib/games');

exports.reset = function(req, res, next) {
    games.supported.forEach(function(game) {
        $db.get(game +'_dumps').drop();
        $db.get(game +'_games').drop();
        $db.get(game +'_players').drop();
    });

    global.ladder = {};

    res.send(200);
};

exports.buffer = function(req, res, next) {
    $db.get(req.params.game +'_dumps').findOne({idno: parseInt(req.params.gameId)}, function(err, data) {
        data.buffers.forEach(function(buffer, index) {
            data.buffers[index] = buffer.buffer.toString('hex');
        });

        res.send(data.buffers);
    });
};

exports.gameres = function(req, res, next) {
    $db.get(req.params.game +'_dumps').findOne({idno: parseInt(req.params.gameId)}, function(err, data) {

        data.buffers.forEach(function(buffer, index) {
            data.buffers[index] = gameres.parse(buffer.buffer);
            delete data.buffers[index].buffer;
        });

        res.send(data.buffers);
    });
};

exports.submit = function(req, res, next) {
    res.send(gameres.parse(req.body));
};
