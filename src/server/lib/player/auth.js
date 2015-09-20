var $mysql = require(global.cwd + '/lib/mysql');
var $db = require(global.cwd + '/lib/mongo');
var $q = require('q');

module.exports = function auth(game, player, username, password) {
    var deferred = $q.defer();

    authorize(username, password).then(function(uid) {
        /* forum user not found or login incorrect */
        if (!uid) return deferred.reject();

        var $players = $db.get(game + '_players');
        $players.find({name: player}, function(err, data) {
            data = data || {};

            /* success if forum id assocated to player */
            if (data.uid == uid) return deferred.resolve();

            /* otherwise associate forum id */
            if (!data.uid) {
                $players.update({name: player}, {
                    $set: {uid: uid}
                }, {upsert: true});

                deferred.resolve();
            }
        });

    });

    return deferred.promise;
};

function authorize(username, password) {
    var deferred = $q.defer();

    var query = $mysql.format(
        'SELECT id_member FROM smf_members WHERE real_name = ? AND passwd = SHA1(CONCAT(?, ?))',
        [username, username.toLowerCase(), password]
    );

    $mysql.query(query, function(err, results) {
        if (results.length < 1) return deferred.resolve(0);
        deferred.resolve(results[0].id_member || 0);
    });

    return deferred.promise;
}
