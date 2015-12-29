var restify = require('restify'),
    app = restify.createServer(),
    path = require('path'),
    WOL_PORT = process.env.WOL_PORT || 4007;

global.noop = function(){};
global.cwd = __dirname;
global.DEFAULT_POINTS = 1000;
global.DAILY_LIMIT = 3;

/* route separation http://bit.ly/1Kt87xZ */
var ping = require('./routes/ping'),
    ladder = require('./routes/ladder'),
    auth = require('./routes/auth'),
    debug = require('./routes/debug'),
    clans = require('./routes/clans');

app.use(restify.queryParser());
app.use(restify.jsonp());
app.use(restify.bodyParser());

/* ensure game abbr is valid */
app.use(function(req, res, next) {
    if (!req.params.game) return next();
    /* in case client sends abbrv in caps */
    req.params.game = req.params.game.toLowerCase();
    if (!(!!req.params.game.match(/^(td|d2k?|ra2?|tsm?|dta|fs|yr|am)$/))) {
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
app.get('/ladder/:game/game/:gameId', ladder.match); // game info
app.get('/ladder/:game/player/:player', ladder.player); // player info
app.post('/ladder/:game/search', ladder.search);

/* clan */
app.get('/ladder/:game/clan/:clan', clans.info); // clan info
app.put('/ladder/:game/clan/:clan', clans.create); // create clan
app.post('/ladder/:game/clan/:clan', clans.adjust); // join/leave/modify clan
app.del('/ladder/:game/clan/:clan', clans.destroy); // delete clan

/* auth */
app.get('/auth/:player', auth.player);
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
    console.log('WOL Leaderboard listening on %s:%s', app.name, app.url);
});

app.on('uncaughtException', function (req, res, route, err) {
    res.send(500);
    console.log('uncaughtException: %s', err.message);
    console.log(err.stack);
});

process.on('uncaughtException', function (err) {
    console.log('uncaughtException: %s', err.message);
    console.log(err.stack);
});
