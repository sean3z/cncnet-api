var $db = require('monk')('localhost/leaderboard');
var games = require('./games');

games.supported.forEach(function(game) {
    $db.get(game +'_dumps').index('idno', {unique: true});
    $db.get(game +'_players').index('name', {unique: true});
    $db.get(game +'_games').index('idno', {unique: true});
});

$db.get('auth').index('name', {unique: true});

module.exports = $db;
