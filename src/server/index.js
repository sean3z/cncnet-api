var restify = require('restify');
var app = restify.createServer();
var path = require('path');
var WOL_PORT = process.env.WOL_PORT || 4007;

/* route separation http://bit.ly/1Kt87xZ */
var ping = require('./routes/ping');
var leaderboard = require('./routes/leaderboard');
var auth = require('./routes/auth');
var debug = require('./routes/debug');

app.use(restify.queryParser());
app.use(restify.jsonp());
app.use(restify.bodyParser());

/* ensure game abbr is valid */
app.use(function(req, res, next) {
    if (!req.params.game) return next();
    if (!(!!req.params.game.match(/^(td|d2k?|ra2?|ts|fs|yr)$/))) {
        return next(new Error('game abbr invalid'));
    }
    /* in case someone sends in caps */
    req.params.game = req.params.game.toLowerCase();
    next();
});

/* declare api version */
app.use(function(req, res, next) {
    res.header('API-Version', require('../../package').version);
    next();
});

/* general */
app.get('/ping', ping);

/* leaderboard */
app.post('/ladder/:game', leaderboard.incoming);
app.get('/ladder/:game', leaderboard.rankings);
app.get('/ladder/:game/game/:gameId', leaderboard.match);
app.post('/ladder/:game/search', leaderboard.search);

/* auth */
app.get('/auth/:game/:player', auth.player);
app.put('/auth/:game/:player', auth.create);

/* debug */
app.get('/debug/reset', debug.reset);

/* static server for development */
app.get(/.*/, restify.serveStatic({
    directory: __dirname + '/../../dist/public',
    default: 'index.html'
}));

app.listen(WOL_PORT, function() {
    console.log('WOL Leaderboard listening on %s:%s', require('os').hostname(), WOL_PORT);
});
