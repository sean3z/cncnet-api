var $db = require(global.cwd + '/lib/mongo');

module.exports = function information(game, gameId) {
  return new Promise(function(resolve, reject) {
    $db.get(game +'_games').find({idno: gameId}, function(err, data) {
        if (data.length < 1) return reject();
        resolve(data[0]);
    });
  });
};
