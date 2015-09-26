var $mysql = require(global.cwd + '/lib/mysql');
var $db = require(global.cwd + '/lib/mongo');
var $q = require('q');

module.exports = function auth(game, player, username, password) {
    var deferred = $q.defer();

    authorize(username, password).then(function(record) {
        /* forum user not found or login incorrect */
        if (!record.id_member) return deferred.reject();

        var $players = $db.get(game + '_players');
        $players.find({name: player}, function(err, data) {
            data = data || {};

            /* success if forum id assocated to player */
            if (data.uid == record.id_member) return deferred.resolve();

            /* otherwise associate forum id */
            if (!data.uid) {
                $players.update({name: player}, {
                    $set: {
                        uid: record.id_member,
                        email: record.email_address,
                        avatar: record.avatar
                    }
                }, {upsert: true});

                return deferred.resolve();
            }

            deferred.reject();
        });

    });

    return deferred.promise;
};

function authorize(username, password) {
    var deferred = $q.defer();

    var query = $mysql.format(
        'SELECT id_member, email_address, avatar FROM smf_members WHERE real_name = ? AND passwd = SHA1(CONCAT(?, ?))',
        [username, username.toLowerCase(), password]
    );

    $mysql.query(query, function(err, results) {
        if (results.length < 1) return deferred.resolve({});
        deferred.resolve(results[0] || {});
    });

    return deferred.promise;
}
