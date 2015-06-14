/* collection of game related helper functions */
var $db = require('./mongo');
var gameres = require('./gameres');
var $q = require('q');

exports.process = function(game, dmp) {
    var defer = $q.defer();
    var match = gameres(dmp);

    defer.resolve(match);

    // create raw dump entry
    var buffer = match.buffer.toString('utf8');
    $db.get(game +'_dumps').update(
        {idno: match.idno},
        {$push: {buffer: buffer}},
        {upsert: true}
    );

    // create player entry
    match.players.forEach(function(player) {
        // locate player; insert or update
    });

    // create game entry
    // mongo.insert(game +'_'+ 'games', dmp);
    // locate ts_dumps document with matching idno then insert or update

    return defer.promise;
};
