var express = require('express');
var environment = process.env.NODE_ENV || 'production';
var config = require('./config');
var Packet = require(__dirname +'/lib/Packet.js');
var Database = require(__dirname +'/lib/Database.js');
var Authentication = require(__dirname +'/lib/Authentication.js');
var Ladder = require(__dirname +'/lib/Ladder.js');
var GameRes = require(__dirname +'/lib/GameResolution.js');
var port = process.env.WOL_LADDER_PORT || 4007;

var app = restify.createServer();
app.use(restify.bodyParser());
app.use(restify.authorizationParser());
app.use(restify.fullResponse());

Database.configure(config.database);

var lids = {
	search: function (lid) {
		return this[lid] || 0;
	}
};

// Prefetch lids for faster lookup
Database.query('SELECT lid, abbrev FROM wol_ladders', function (err, data) {
	for (var i = data.length - 1; i >= 0; i--) {
		lids[data[i].abbrev] = data[i].lid;
	}
});

/*app.get('/ping', function(req, res, next) {
	res.send('pong');
    return next();
});

// @TODO: open similar udp listener
app.post('/ladder/:game', function (req, res, next) {
	var _packet = new Packet({
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
	});
});

app.get('/ladder/:game', function(req, res, next) {
	// return top 250 players for given game
    Ladder.top(250, lids.search(req.params.game)).then(function(response) {
        res.status(response.status || 200);
        if (response.body) {
            res.send(response.body);
        }
        next();
    });

});

app.get('/ladder/:game/game/:gameId', function(req, res, next) {
	// return all data for given gameId
	res.json({test: 2});
    return next();
});

app.put('/ladder/:game/player/:player', function(req, res, next) {
	var account = {
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		name: req.params.player,
		lid: lids.search(req.params.game),
		game: req.params.game,
		create: true
	};

	Authentication.create(account).then(function(response) {
		res.status(response.status || 400);

		if (response.location) {
			res.header('Location', response.location);
		}

		if (response.body) {
			res.json(response.body);
		}

		res.end();
        next();
	});
});

app.get('/ladder/:game/player/:player', function(req, res, next) {
	// return all data for given player
	res.json({test: 3});
    return next();
});

app.get('/ladder/:game/player/:player/auth', function(req, res, next) {

	var password = req.authorization.basic || {},
		attempt = {
			username: req.username, 
			password: password.password,
			ipa: req.connection.remoteAddress
		};

	Authentication.identify(attempt).then(function(response) {
		res.status(response.status || 401);
		res.header('WWW-Authenticate', 'Basic realm="Ladder Auth"');

		if (response.body) {
			res.json(response.body);
		}

		res.end();
        next();
	});
});

app.get('/debug/gameres/:hash', function(req, res, next) {
	var query = Database.format(
		'SELECT HEX(packet) as packet FROM wol_games_raw WHERE hash = ?', [req.params.hash]
	);

	Database.query(query, function(err, results) {
		if (results.length < 1) {
			res.send('Not Found');
			return;
		}

		res.json(GameRes.parse(results[0].packet));
        next();
	});
});

app.get('/debug/gameres/:hash/raw', function(req, res, next) {
    var query = Database.format(
		'SELECT HEX(packet) as packet FROM wol_games_raw WHERE hash = ?', [req.params.hash]
	);

	Database.query(query, function(err, results) {
		if (results.length < 1) {
			res.send('Not Found');
			return;
		}

		res.send(results[0].packet);
        next();
	});

});

app.post('/debug/gameres/', function(req, res, next) {
    res.json(GameRes.parse(req.body));
    return next();
});

app.get(/.*/, restify.serveStatic({
    directory: __dirname + '/../dist/www',
    default: 'index.html'
}));*/

app.listen(port, function() {
	console.log('WOL Ladder listening on %s:%s', require('os').hostname(), port);
});
