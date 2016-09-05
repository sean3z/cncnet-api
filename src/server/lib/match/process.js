var $db = require(global.cwd + '/lib/mongo'),
    debug = require('debug')('wol:leaderboard'),
    ranking = require('../ranking'),
    MATCH_DELAY = parseInt(process.env.MATCH_DELAY) || 90000;

/* match cache for quick comparison */
global.matches = {};

var games = {
    ra: require(global.cwd + '/lib/games/lib/ra'),
    ts: require(global.cwd + '/lib/games/lib/ts')
};

module.exports = function process(game, dump) {
    var match = require(__dirname + '/lib/parse')(game, dump);

    /* TODO: REMOVE!! */
    /* hack until tests and client packets are updated */
    match.settings.trny = 1;

    /* TS Scenario: note whether game map is mod or ww */
    if (game === 'ts') {
        match.settings = games[game].official(match.settings);
        if (!match.settings.official) {
            game = 'tsm'; /* tiberian sun mod map */
        }
    }

    /* discontinue if no gameId or match is less than 1 minute */
    if (!match.idno || match.dura < 60) return;
    debug('game: %s, idno: %d game received', game, match.idno);
    if (!global.matches[game]) global.matches[game] = {};
    global.matches[game][match.idno] = global.matches[game][match.idno] || [];

    // create raw dump entry
    // TODO: check against spid (sender id) to ensure only 1 packet from each player
    // TODO: idno is random but could collide. check if record exists and compare dates
    var $dumps = $db.get(game +'_dumps');
    $dumps.update({idno: match.idno}, {$push: {buffers: match.buffer}}, {upsert: true}).error(function(err) {
        console.log('match/process dump entry error');
        console.log('game: %s, match: %d', game, match.idno);
        console.log('buffer: %s', match.buffer.toString('hex'));
        console.dir(err);
    });

    global.matches[game][match.idno].push({
        unid: match.client.unid,
        nick: match.client.nick
    });

    // only continue if this is the first entry for a game
    if (global.matches[game][match.idno].length > 1) return;

    // remove unused properties from game object
    delete match.buffer; /* only used for previous parsing */
    delete match.client; /* unused information about the client */

    /* save match */
    var p = $db.get(game +'_games').insert(match);
    p.success(function(doc) {
        debug('game: %s, idno: %d game saved!', game, match.idno);

        /* further processing at a 1.5 minute delay */
        /* this allows time for all packets to arrive */
        setTimeout(function() {
            delete global.matches[game][match.idno];

            /* add match to all players objects involved */
            $players = $db.get(game + '_players');
            match.players.forEach(function (player, index) {
                /* query to update player obj */
                var _player = {
                    $push: {games: match.idno},
                }

                $players.update({name: player.name}, _player, {upsert: true}).error(function(err) {
                    console.log('match/process game entry player update error');
                    console.log('game: %s, match: %d, player: %s', game, match.idno, player.name);
                    console.dir(err);
                });
            });

            /* process ranking only if game is trny */
            if (match.settings.trny) {
                ranking.process(game, match);
            }
        }, MATCH_DELAY);
    });

    p.error(function(err) {
        console.log('!! Error when trying to save game: %s idno: %d', game, match.idno);
        console.dir(err);
    });

    return;
};
