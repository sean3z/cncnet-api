var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var WOL_PORT = process.env.WOL_PORT || 4007;

/* route separation http://bit.ly/1Kt87xZ */
var ping = require('./routes/ping');
var ladder = require('./routes/ladder');
var auth = require('./routes/auth');

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/../../dist/public')));

/* ensure game abbr is valid */
app.param('game', function(req, res, next, abbr) {
    if (!(!!abbr.match(/^(td|d2k?|ra2?|ts|fs|yr)$/))) {
        return next(new Error('game abbr invalid'));
    }
    next();
});

/* general */
app.get('/ping', ping);

/* ladder */
app.post('/ladder/:game', ladder.game);

/* auth */
app.get('/auth/:game/:player', auth.player);
app.put('/auth/:game/:player', auth.create);

/* error handler */
app.use(function(err, req, res, next) {
    res.status(500).json({error: err.message, stack: err.stack});
});

app.listen(WOL_PORT, function() {
    console.log('WOL Ladder listening on %s:%s', require('os').hostname(), WOL_PORT);
});
