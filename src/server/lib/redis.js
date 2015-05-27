var debug = require('debug')('ladder');
var client = require('redis').createClient();

client.on('error', function(err) {
    throw err;
});

client.on('connect', function() {
    debug('Connected to Redis');
});

module.exports = client;
