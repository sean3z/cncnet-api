var $db = require('./mongo');
var debug = require('debug')('wol:leaderboard');
var Arpad = require('arpad');
var $q = require('q');

// TODO: move this whole function somewheres else
/* saves player and game data */
exports.process = function(game, match) {
    var deferred = $q.defer();

    /* fail if we're somehow missing players */
    if (!match.players || match.players.length < 1) return;

    // create player entry
    var $players = $db.get(game +'_players');
    match.players.forEach(function(player, i) {
        /* typically Computer */
        if (!player.nam) {
            player.nam = 'Computer';
            return;
        }

        /* remove spectators */
        if (player.spc && player.spc > 0) {
            delete match.players[i];
            return;
        }

        // TODO: increase player map count
        var stats = {
            $push: {games: match.idno},
            $inc: {}
        };

        /* evaluate completions */
        if (player.cmp) {
            switch (player.cmp) {
                case 2:
                    stats.$inc.losses = 1;
                    stats.$inc.disconnects = 1;
                break;

                case 256:
                    stats.$inc.wins = 1;
                break;

                case 512:
                case 528:
                    stats.$inc.losses = 1;
                break;
            }
        }

        /* remove unused info */
        delete player.ipa; /* could be tunnel or p2p (unreliable) */
        delete player.addr; /* same reason but for ra1 */
        delete player.ser; /* serials are not used on CnCNet */
        delete player.accn; /* funky's client specific */

        $players.update({name: player.nam}, stats, {upsert: true});

        /* tack on stats so it can be referenced in game object */
        player.__gains = stats.$inc;
    });

    /* handle any game specific processing (bonuses?) */
    // require('../game/' + game).process(match);

    /* handle elo only for 1v1 games */
    if (match.players.length == 2) {
        var elo = new Arpad();
        var winner = (match.players[0].__gains.wins) ? 0 : 1;
        var loser = (winner == 1) ? 0 : 1;
        $players.find({name: {$in: [match.players[0].nam, match.players[1].nam]}}, function(err, data) {
            if (data && data.length == 2) {
                data.forEach(function(player, index) {
                    var opponent = (index === 0) ? 1 : 0;
                    if (player.name == match.players[winner].nam)  {
                        points = elo.newRatingIfWon(player.points || 1500, data[opponent].points || 1500);
                        match.players[winner].__gains.points = points - (player.points || 1500);
                    } else {
                        points = elo.newRatingIfLost(player.points || 1500, data[opponent].points || 1500);
                        match.players[loser].__gains.points = (player.points || 1500) - points;
                    }

                    $players.update({_id: player._id}, {$set: {points: points}});
                });
            }

            deferred.resolve(match);
        });
    } else {
        deferred.resolve(match);
    }

    return deferred.promise;
};

/* WOL Game Resolution interpreter */
exports.parse = function(packet) {
    var buffer = packet;
    if (typeof packet === 'string') {
        // remove any unnessiccary whitespace
        packet = packet.replace(/(\r|\n|\r\n|\s+)/gm, '');
        buffer = new Buffer(packet, 'hex');
    }

    var flat = {}, i = 4;
    flat.buffer = buffer;
    var slice = buffer.slice(0, 4);
    var bufferLength = slice.readUInt16BE(0);

    while (i < bufferLength) {
        var chunk = buffer.slice(i,  i + 4);
        var field = chunk.toString();

        i += 4;

        chunk = buffer.slice(i, i + 8);

        var type = chunk.readUInt16BE(0);
        var length = chunk.readUInt16BE(2);
        var data = 'Unprocessed Data';

        i += 4;

        var end = i + length >= bufferLength ? bufferLength : i + length;

        if (i <= end) {
            data = _type(type, buffer.slice(i, end));
            length = Math.ceil(length / 4) * 4;
            i += length;
        }

        flat[field] = data;
    }

    return _consolidate(flat);
}

/* WOL field type interpreter */
function _type(type, chunk) {
    var data = 'Unprocessed Type';

    switch (type) {
        case 1:
            // [15:39:10] <CCHyper> 1 = byte
            data = chunk.readInt8(0);
        break;

        case 2:
            // [15:39:24] <CCHyper> 2 = boolean
            data = chunk.readInt8(0) > 0 ? 1 : 0;
        break;

        case 3:
            // [15:38:14] <CCHyper> 3 = short
            data = chunk.readInt16BE(0);
        break;

        case 4:
            // [15:38:07] <CCHyper> 4 = unsigned short
            data = chunk.readUInt16BE(0);
        break;

        case 5:
            // [15:37:56] <CCHyper> 5 = long
            data = chunk.readInt32BE(0);
        break;

        case 6:
            // [15:37:49] <CCHyper> 6 = ulong/ unsigned long
            data = chunk.readUInt32BE(0);
        break;

        case 7:
            // [15:38:35] <CCHyper> 7= char
            data = chunk.toString('ascii').replace('\u0000', ''); // charCode(0) at end of string
            if (data == "ON") data = 1;
            else if (data == "OFF") data = 0;
        break;

        case 20:
            // [15:39:34] <CCHyper> 20 is a string
            // [15:40:28] <CCHyper> 0x14 is qword
            var _data = 0, x = -1;
            for (var i = 0; i < chunk.length; i += 4) {
                var end = i + 4 >= chunk.length ? chunk.length : i + 4;
                var slice = chunk.slice(i, end);
                _data += slice.readUInt32BE(0);
            }
            data = _data;
        break;
    }

    return data;
}

/* consolidate player stats */
function _consolidate(flat) {
    var consolidated = {players: [], settings: {}, client: {}};
    var settings = ['sped', 'plrs', 'scen', 'tech', 'unit', 'flag', 'shad', 'crat', 'tibr', 'base', 'cred', 'trny', 'shrt', 'supr', 'aipl', 'nump'];
    var client = ['vers', 'vidm', 'memo', 'proc', 'afps', 'oosy', 'gsku', 'spid', 'accn', 'cmpl', 'quit', 'unid'];

    if (flat.NAM0 || flat.NAM1) {
        for (var item in flat) {
            var value = flat[item];
            var key = item.toLowerCase();
            var index = parseInt(key.slice(-1));

            /* player stats */
            if (index > -1) {
                if (!consolidated.players[index]) consolidated.players[index] = {};
                consolidated.players[index][key.slice(0, -1)] = value;
                continue;
            }

            /* game settings */
            if (settings.indexOf(key) > -1) {
                consolidated.settings[key] = value;
                continue;
            }

            /* client settings */
            if (client.indexOf(key) > -1) {
                consolidated.client[key] = value;
                continue;
            }

            consolidated[key] = value;
        }
    }

    /* players[0] is sometimes undefined? h4x */
    if (consolidated.players[0] === undefined) {
        consolidated.players.shift();
    }

    /* overwrite date */
    consolidated.date = Math.floor(Date.now() / 1000);
    return consolidated;
}
