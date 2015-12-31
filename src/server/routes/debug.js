var debug = require('debug')('wol:leaderboard'),
    $db = require('../lib/mongo'),
    gameres = require('../lib/gameres'),
    games = require('../lib/games');

exports.reset = function(req, res, next) {
    var date = new Date();
    var hof = {
        month: date.getMonth(),
        year: date.getFullYear()
    };

    games.supported.forEach(function(game) {
        if (global.ladder[game]) {
            hof[game] = global.ladder[game].slice(0, 10);
        }

        var reset = {
            $set: {
                points: global.DEFAULT_POINTS,
                games: [],
                wins: 0,
                losses: 0,
                disconnects: 0,
                oos: 0
            }
        };

        $db.get(game +'_players').update({}, reset, {multi: true});
        $db.get(game +'_clans').update({}, reset, {multi: true});
    });

    global.ladder = {};

    /* cleanup HoF */
    // @TODO if hof[game].length < 10 or each player doesn't
    // have at least 1 win; remove from hof[game]

    $db.get('hof').insert(hof);

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

    if (!req.body) return res.send(400);

    res.send(gameres.parse(req.body));
};
