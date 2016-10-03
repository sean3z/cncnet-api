var restify = require('restify');
var app = restify.createServer();
var WOL_PORT = process.env.WOL_PORT || 4007;

global.noop = function(){};
global.cwd = __dirname;
global.DEFAULT_POINTS = 1000;
global.DAILY_LIMIT = 3;
global.WOL_ADMIN = process.env.WOL_ADMIN || 'supersecret';

/* route separation http://bit.ly/1Kt87xZ */
var ping = require('./routes/ping');
var ladder = require('./routes/ladder');
var auth = require('./routes/auth');
var debug = require('./routes/debug');
var clans = require('./routes/clans');
var hof = require('./routes/hof');

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

/* declare api version and allow origin/headers */
app.use(function(req, res, next) {
    res.header('API-Version', require('../../package').version);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'accept, authorization');
    next();
});

app.opts(/\.*/, function (req, res, next) {
    res.send(200);
    next();
});

/* general */
app.get('/ping', ping);

/* hall of fame (hof) */
app.get('/ladder/hof', hof.list);
app.get('/ladder/hof/snapshot', hof.snapshot);

/* leaderboard */
app.post('/ladder/:game', auth.required, ladder.submit);
app.get('/ladder/:game', ladder.ladder);
app.get('/ladder/:game/game/:gameId', ladder.match); // game info
app.get('/ladder/:game/player/:player', ladder.player); // player info
app.post('/ladder/:game/search', ladder.search);

/* clan */
app.get('/ladder/:game/clan/:clan', clans.info); // clan info
app.put('/ladder/:game/clan/:clan', auth.required, clans.create); // create clan
app.post('/ladder/:game/clan/:clan', auth.required, clans.adjust); // join/leave/modify clan
app.del('/ladder/:game/clan/:clan', auth.required, clans.destroy); // delete clan

/* auth */
app.get('/auth/:player', auth.required, auth.player);
app.put('/auth/:player', auth.required, auth.player);

/* debug */
app.get('/debug/buffer/:game/:gameId', debug.buffer);
app.get('/debug/gameres/:game/:gameId', debug.gameres);
app.post('/debug/gameres/:game', debug.submit);

app.listen(WOL_PORT, function () {
    console.log('WOL Leaderboard listening on %s:%s', app.name, app.url);
});

app.on('uncaughtException', function (req, res, route, err) {
    console.log('uncaughtException: %s', err.message);
    console.log(err.stack);
});

process.on('uncaughtException', function (err) {
    console.log('uncaughtException: %s', err.message);
    console.log(err.stack);
});
