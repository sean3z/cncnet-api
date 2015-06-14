//var packet = require('./lib/packet');
var match = require('../lib/match');
var debug = require('debug')('wol:leaderboard');

exports.match = function (req, res, next) {
    debug('recieved WOL Gameres packet');
/*        var _packet = new Packet({
        packet: req.body, 
        lid: lids.search(req.params.game),
        game: req.params.game
    });

    _packet.handle().then(function(response) {
        res.status(response.status || 200);
        if (response.location) {
            res.header('Location', response.location);
        }
        res.end();
        next();
    });*/
    match.process(req.params.game, req.body).then(function(match) {
        res.send(match);
    });
    // res.send(game.process(req.body));
};
