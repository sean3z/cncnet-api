var debug = require('debug')('wol:leaderboard');
var $db = require('../lib/mongo');
var gameres = require('../lib/gameres');

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
