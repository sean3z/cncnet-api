var debug = require('debug')('wol:leaderboard');

exports.indo = function(match) {
  var players = [];
  match.players.forEach(function(player) {
    players.push(player.name);
  });

  var critera = [
    match.idno,
    players.sort(),
    JSON.stringify(match.settings)
  ].join('');

  var idno;
  try {
    idno = Math.abs(hashCode(critera));
  } catch(e) {
    // do nothing
  }

  return idno || match.idno;  
};

var hashCode = function(str){
    var hash = 0, chr;
    if (str.length == 0) return hash;
    for (var i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
