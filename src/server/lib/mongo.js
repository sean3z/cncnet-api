var $db = require('monk')('localhost/leaderboard');
$db.get('ts_dumps').index('idno', {unique: true});
$db.get('ts_players').index('name', {unique: true});
$db.get('ts_games').index('idno', {unique: true});
$db.get('ts_ladder').index('rank', {unique: true});

$db.get('ra_dumps').index('idno', {unique: true});
$db.get('ra_players').index('name', {unique: true});
$db.get('ra_games').index('idno', {unique: true});
$db.get('ra_ladder').index('rank', {unique: true});

module.exports = $db;
