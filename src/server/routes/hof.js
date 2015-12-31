var debug = require('debug')('wol:leaderboard'),
    $db = require('../lib/mongo');

exports.list = function(req, res, next) {
  var search = {};

  if (req.params.month) {
    search.month = parseInt(req.params.month);
  }

  if (req.params.year) {
    search.year = parseInt(req.params.year);
  }

  // @TODO: if month or year provided use .findOne()
  $db.get('hof').find(search, function(err, data) {
    res.send(data);
  });
};