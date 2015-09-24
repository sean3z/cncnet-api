var $db = require('monk')('localhost/leaderboard');
var games = require('./games');

games.supported.forEach(function(game) {
    $db.get(game +'_dumps').index('idno', {unique: true});
    $db.get(game +'_players').index('name', {unique: true});
    $db.get(game +'_game').index('idno', {unique: true});
});

module.exports = $db;
