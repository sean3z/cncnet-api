var $db = require('monk')('localhost/leaderboard');
var games = ('../games');

games.supported.forEach(function(game) {
    $db.get(game +'_dumps').index('idno', {unique: true})
    $db.get(game +'_games').index('name', {unique: true});
    $db.get(game +'_players').index('idno', {unique: true});
});

module.exports = $db;
