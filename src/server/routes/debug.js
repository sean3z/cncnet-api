var debug = require('debug')('wol:leaderboard');
var $db = require('../lib/mongo');
var gameres = require('../lib/gameres');

exports.game = function(req, res, next) {
    console.log('req.params.game', req.params.game);
    console.log('req.params.gameId', req.params.gameId);
    $db.get(req.params.game +'_dumps').find({idno: req.params.gameId}, _found);

    function _found(err, data) {
        console.log(data);
//        data[0].buffers.forEach(function(buffer) {
//            buffer = gameres(buffer);
//        });

        res.send({test: 1});
    }
};

exports.reset = function(req, res, next) {
    $db.get('ts_dumps').drop();
    $db.get('ts_games').drop();
    $db.get('ts_players').drop();

    $db.get('ra_dumps').drop();
    $db.get('ra_games').drop();
    $db.get('ra_players').drop();

    $db.get('td_dumps').drop();
    $db.get('td_games').drop();
    $db.get('td_players').drop();

    $db.get('d2_dumps').drop();
    $db.get('d2_games').drop();
    $db.get('d2_players').drop();

    res.send(200);
};
