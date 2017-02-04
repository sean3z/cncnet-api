/*jshint -W004 */
var $db = require(global.cwd + '/lib/mongo');
var debug = require('debug')('wol:leaderboard');
var crypto = require('crypto');

// storage for unused ids
var _cache = {};

function create(game, options) {
  return new Promise(function(resolve, reject) {
    _cache[game] = _cache[game] || [];

    // check _cache for any known (available) ids
    if (_cache[game].length > 0) {
      return insert(_cache[game].pop(), game, options).then(resolve, reject);
    }

    // no known available ids, try searching for one
    find(game).then(function(ids) {
      // no available ids, try again
      if (!ids.length) {
        create(game, options).then(resolve, reject);
        return; 
      }

      // take remaining (valid) ids and put in cache
      for (var i = ids.length - 1; i >= 0; i--) {
        _cache[game].push(ids[i]);
      }

      insert(_cache[game].pop(), game, options).then(resolve, reject);
    });
  });
};

function insert(gameId, game, options) {
  return new Promise(function(resolve, reject) {
    options = options || {};
    options.idno = gameId;

    debug('creating placeholder game: %s idno: %d', game, gameId);

    $db.get(game +'_games').insert(options, function(err, data) {
      if (err) return reject(err);
      resolve(gameId);
    });
  });
}

function find(game) {
  return new Promise(function(resolve, reject) {
    var ids = random();
    var $games = $db.get(game +'_games');
    $games.find({idno: {$in: ids}}, function(err, data) {
      if (err) return reject(err);

       // all numbers are free!
      if (!data.length) return resolve(ids);

      // alright, remove taken numbers
      for (var i = data.length - 1; i >= 0; i--) {
        ids.splice(ids.indexOf(data[i].idno), 1);
      }

      return resolve(ids);
    });
  }); 
}

function random() {
  var numbers = [];

  for (var i = 25; i >= 0; i--) {
    var delimiter = Math.floor(Math.random() * 8) + 2;

    var number = crypto
      .randomBytes(10)
      .toString('hex')
      .replace(/\D/g, '')
      .substring(0, delimiter);

    numbers.push(parseInt(number));
  }

  return numbers;
}

module.exports = create;