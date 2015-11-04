var restify = require('restify');
var app = restify.createServer();
var path = require('path');
var WOL_PORT = process.env.WOL_PORT || 4007;

global.noop = function(){};
global.cwd = __dirname;

/* route separation http://bit.ly/1Kt87xZ */
var ping = require('./routes/ping');
var ladder = require('./routes/ladder');
var auth = require('./routes/auth');
var debug = require('./routes/debug');

app.use(restify.queryParser());
app.use(restify.jsonp());
app.use(restify.bodyParser());

/* ensure game abbr is valid */
app.use(function(req, res, next) {
    if (!req.params.game) return next();
    /* in case client sends abbrv in caps */
    req.params.game = req.params.game.toLowerCase();
    if (!(!!req.params.game.match(/^(td|d2k?|ra2?|ts|dta|fs|yr|am)$/))) {
        return next(new Error('game abbr invalid'));
    }
    next();
});

/* declare api version and allow origin */
app.use(function(req, res, next) {
    res.header('API-Version', require('../../package').version);
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

/* general */
app.get('/ping', ping);

/* leaderboard */
app.post('/ladder/:game', ladder.submit);
app.get('/ladder/:game', ladder.ladder);
app.get('/ladder/:game/game/:gameId', ladder.match);
app.get('/ladder/:game/player/:player', ladder.player);
app.post('/ladder/:game/search', ladder.search);

/* auth */
app.get('/auth/:player', auth.player);
app.get('/auth/:game/:player', auth.player); // temp route to support legacy consumers
// app.put('/auth/:player', auth.create); // registration through cncnet forums

/* debug */
app.get('/debug/reset', debug.reset);
app.get('/debug/buffer/:game/:gameId', debug.buffer);
app.get('/debug/gameres/:game/:gameId', debug.gameres);
app.post('/debug/gameres/:game', debug.submit);

/* static server for development */
app.get(/.*/, restify.serveStatic({
    directory: __dirname + '/../../dist/public',
    default: 'index.html'
}));

app.listen(WOL_PORT, function () {
    console.log('WOL Leaderboard listening on %s:%s', require('os').hostname(), WOL_PORT);
});

app.on('uncaughtException', function (req, res, route, err) {
    res.send({
        message: err.message,
        stack: err.stack
    });
});
