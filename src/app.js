/***
*   Copyright 2014 Sean Wragg <seanwragg@gmail.com>
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*	   http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

var restify = require('restify'),
	environment = process.env.NODE_ENV || 'production',
	config = require(__dirname +'/config.json')[environment],
	Packet = require(__dirname +'/lib/Packet.js'),
	Database = require(__dirname +'/lib/Database.js'),
	Authentication = require(__dirname +'/lib/Authentication.js'),
	Ladder = require(__dirname +'/lib/Ladder.js'),
	GameRes = require(__dirname +'/lib/GameResolution.js'),
	port = process.env.WOL_LADDER_PORT || 4007;

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

/* adding d2k hack since FunkyFr3sh is lazy :P */
lids['dune 2000'] = 6;
lids['dune%202000'] = 6; /* unsure whether restify will urlencode */

app.get('/ping', function(req, res) {
	res.send('pong');
});

// @TODO: open similar udp listener
app.post('/ladder/:game', function (req, res) {
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
	});
});

app.get('/ladder/:game', function(req, res) {
	// return top 250 players for given game
    Ladder.top(250, lids.search(req.params.game)).then(function(response) {
        res.status(response.status || 200);
        if (response.body) {
            res.send(response.body);
        }
    });

});

app.get('/ladder/:game/game/:gameId', function(req, res) {
	// return all data for given gameId
	res.json({test: 2});
});

app.put('/ladder/:game/player/:player', function(req, res) {
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
	});
});

app.get('/ladder/:game/player/:player', function(req, res) {
	// return all data for given player
	res.json({test: 3});
});

app.get('/ladder/:game/player/:player/auth', function(req, res) {

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
	});
});

app.get('/debug/gameres/:hash', function(req, res) {
	var query = Database.format(
		'SELECT HEX(packet) as packet FROM wol_games_raw WHERE hash = ?', [req.params.hash]
	);

	Database.query(query, function(err, results) {
		if (results.length < 1) {
			res.send('Not Found');
			return;
		}

		res.json(GameRes.parse(results[0].packet));
	});
});

app.get('/debug/gameres/:hash/raw', function(req, res) {
    var query = Database.format(
		'SELECT HEX(packet) as packet FROM wol_games_raw WHERE hash = ?', [req.params.hash]
	);

	Database.query(query, function(err, results) {
		if (results.length < 1) {
			res.send('Not Found');
			return;
		}

		res.send(results[0].packet);
	});

});

app.post('/debug/gameres/', function(req, res) {
    res.json(GameRes.parse(req.body));
});

app.get(/.*/, restify.serveStatic({
    directory: __dirname + '/../dist/www',
    default: 'index.html'
}));

app.listen(port, function() {
	console.log('SUCCESS!! WOL Ladder listening on port:%s', port);
	console.log('Control + C to cancel');
});
