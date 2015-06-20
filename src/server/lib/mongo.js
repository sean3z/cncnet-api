var $db = require('monk')('localhost/leaderboard');
$db.get('ts_dumps').index('idno', {unique: true});
$db.get('ts_players').index('name', {unique: true});
$db.get('ts_games').index('idno', {unique: true});
module.exports = $db;
