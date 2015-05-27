var debug = require('debug')('ladder');
var Client = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/ladder';

Client.connect(url, function(err, db) {
    if (err) throw err;
    debug('Connected to MongoDB');
});

module.exports = Client;
