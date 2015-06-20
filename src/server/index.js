var express = require('express');
var restify = require('restify');
var app = restify.createServer();
var path = require('path');
var WOL_PORT = process.env.WOL_PORT || 4007;

app.use(restify.queryParser());
app.use(restify.jsonp());

/* route separation http://bit.ly/1Kt87xZ */
var ping = require('./routes/ping');
var leaderboard = require('./routes/leaderboard');
var auth = require('./routes/auth');
var debug = require('./routes/debug');

app.use(restify.bodyParser());
/*
app.use(express.static(path.join(__dirname, '/../../dist/public')));

// ensure game abbr is valid
app.param('game', function(req, res, next, abbr) {
    if (!(!!abbr.match(/^(td|d2k?|ra2?|ts|fs|yr)$/))) {
        return next(new Error('game abbr invalid'));
    }
    next();
});
*/

/* general */
app.get('/ping', ping);

/* leaderboard */
app.post('/ladder/:game', leaderboard.match);
app.get('/ladder/:game', leaderboard.rankings);

/* auth */
app.get('/auth/:game/:player', auth.player);
app.put('/auth/:game/:player', auth.create);

/* error handler */
app.use(function(err, req, res, next) {
    res.status(500).json({error: err.message, stack: err.stack});
});

app.listen(WOL_PORT, function() {
    console.log('WOL Leaderboard listening on %s:%s', require('os').hostname(), WOL_PORT);
});
