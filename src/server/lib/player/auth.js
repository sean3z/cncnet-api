var $mysql = require(global.cwd + '/lib/mysql');
var $db = require(global.cwd + '/lib/mongo');
var games = require(global.cwd + '/lib/games');
var $q = require('q');

module.exports = function auth(player, username, password) {
    var deferred = $q.defer();

    authorize(username, password).then(function(record) {
        /* forum user not found or login incorrect */
        if (!record.id_member) return deferred.reject();

        var $auth = $db.get('auth');
        $auth.find({name: player}, function(err, data) {
            data = data || {};

            /* success if forum id associated to player */
            if (data.uid && data.uid == record.id_member) return deferred.resolve();

            /* otherwise create auth entry */
            if (!data.uid) {
                var entry = {
                    name: player,
                    uid: record.id_member,
                    email: record.email_address,
                    avatar: record.avatar
                };

                $auth.insert(entry).success(function() {
                    debug('auth entry created for %s', player);
                    associate(player, record.id_member);
                });
            }

            deferred.reject();
        });
    });

    return deferred.promise;
};

/* add uid to given player in all supported games */
function associate(player, uid) {

    games.supported.forEach(function(game) {
        var $players = $db.get(game + '_players');
        $players.find({name: player}, function(err, data) {
            data = data || {};

            if (data.uid && data.uid != uid) {
                // nick was somehow associated to another user
                // no clue what to do here...
                // something is wrong!! abort abort!!
                return;
            }

            /* associate if not already claimed */
            if (!data.uid) {
                $players.update({name: player}, {
                    $set: {
                        uid: record.id_member,
                        avatar: record.avatar
                    }
                }, {upsert: true});
            }
        });
    });
}

function authorize(username, password) {
    var deferred = $q.defer();

    var query = $mysql.format(
        'SELECT id_member, email_address, avatar FROM smf_members WHERE member_name = ? AND passwd = SHA1(CONCAT(?, ?))',
        [username, username.toLowerCase(), password]
    );

    $mysql.query(query, function(err, results) {
        if (results.length < 1) return deferred.resolve({});
        deferred.resolve(results[0] || {});
    });

    return deferred.promise;
}
