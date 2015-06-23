var $db = require('./mongo');
var $q = require('q');

exports.locate = function(game, player) {
    var defer = $q.defer();
    var regex = new RegExp(player, 'i');
    console.log(regex);
    $db.get(game + '_players').find({name: regex}, function(err, data) {
        console.log(data);
        defer.resolve(data);
    });

    return defer.promise;
};
