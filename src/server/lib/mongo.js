var $db = require('monk')('localhost/leaderboard');

$db.get('ts_dumps').index('idno', {unique: true});
$db.get('ts_players').index('name', {unique: true});
$db.get('ts_games').index('idno', {unique: true});

$db.get('fs_dumps').index('idno', {unique: true});
$db.get('fs_players').index('name', {unique: true});
$db.get('fs_games').index('idno', {unique: true});

$db.get('ra_dumps').index('idno', {unique: true});
$db.get('ra_players').index('name', {unique: true});
$db.get('ra_games').index('idno', {unique: true});

$db.get('am_dumps').index('idno', {unique: true});
$db.get('am_players').index('name', {unique: true});
$db.get('am_games').index('idno', {unique: true});

module.exports = $db;
