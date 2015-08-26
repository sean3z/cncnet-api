var debug = require('debug')('wol:leaderboard');
var $db = require('../lib/mongo');
var gameres = require('../lib/gameres');
var match = require('../lib/match');

exports.reset = function(req, res, next) {
    var games = ['ts', 'ra', 'td', 'd2', 'am', 'fs'];
    games.forEach(function(game) {
        // $db.get(game +'_dumps').drop();
        $db.get(game +'_games').drop();
        $db.get(game +'_players').drop();
    });

    global.cache = {};

    res.send(200);
};

exports.buffer = function(req, res, next) {
    $db.get(req.params.game +'_dumps').findOne({idno: parseInt(req.params.gameId)}, function(err, data) {
        res.send(data.buffers[0].buffer.toString('hex'));
    });
};

exports.gameres = function(req, res, next) {
    $db.get(req.params.game +'_dumps').findOne({idno: parseInt(req.params.gameId)}, function(err, data) {
        res.send(gameres.parse(data.buffers[0].buffer));
    });
};

exports.submit = function(req, res, next) {
    res.send(gameres.parse(req.body));
};

exports.reassess = function(req, res, next) {
    var $dumps = $db.get(req.params.game +'_dumps');
    $dumps.find({}, function(err, data) {
        if (!data || data.length < 1) return;

        var i = 0;
        var $old = $db.get(req.params.game +'_dumps_backup');
        $old.drop();

        (function _next() {
            console.log('i', i);
            if (i < data.length) {
                $old.insert(data[i]).success(function() {
                    _next(i++);
                });
            }

            if (i >= data.length) {
                $dumps.drop().success(function() {
                    $old.find({}, function(err, data) {
                        data.forEach(function(body) {
                            match.process(req.params.game, body.buffers[0].buffer);
                        });

                        res.send({meow: 'cat'});
                    });
                });
            }
        })();
    });

        /*
            $db.get(req.params.game +'_old').find({}, function(err, data) {
        data.forEach(function(body) {
            match.process(req.params.game, body.buffers[0].buffer);
        });

        res.send({meow: 'cat'});
    });
        */

};
