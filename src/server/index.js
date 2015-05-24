var express = require('express');
var app = express();
var WOL_PORT = process.env.WOL_PORT || 4007;
var bodyParser = require('body-parser');

/* route separation http://bit.ly/1Kt87xZ */
var ping = require('./routes/ping');
var ladder = require('./routes/ladder');
var auth = require('./routes/auth');

app.use(bodyParser.raw());
app.use(express.static(__dirname + '/../client'));

// General
app.get('/ping', ping);

// Ladder
app.post('/ladder/:game', ladder.game);

// Auth
app.get('/auth/:game/:player', auth.player);

app.listen(WOL_PORT, function() {
    console.log('WOL Ladder listening on %s:%s', require('os').hostname(), WOL_PORT);
});
