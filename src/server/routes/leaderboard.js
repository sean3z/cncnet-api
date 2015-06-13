//var packet = require('./lib/packet');

exports.game = function (req, res, next) {
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
    res.send('rawr');
};