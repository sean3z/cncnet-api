var debug = require('debug')('wol:leaderboard');

module.exports = {
    create: require('./lib/create'),
    part: require('./lib/part'),
    join: require('./lib/join'),
    modify: require('./lib/modify'),
    destroy: require('./lib/destroy'),
    info: require('./lib/info')
};