var chai = require('chai');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var module = require('module');

global.request = require('request');
global.chai = chai;
global.expect = chai.expect;
global.cwd = path.resolve(__dirname + '/../../src/server');
global.scenarios = path.resolve(__dirname + '/scenarios');
process.env.MONGO_PORT = 27020;
process.env.WOL_PORT = 4007;
process.env.MATCH_DELAY = 5; /* milliseconds */
global.url = 'http://localhost:'+ process.env.WOL_PORT;

console.log('Cleaning up mongodb test directory');
rm(__dirname + '/data/db/');

console.log('Starting mongodb instance..');
global.mongodb = spawn('mongod', [
    '--dbpath', __dirname +'/data/db',
    '--port', process.env.MONGO_PORT
]);

global.mongodb.stdout.on('data', function (data) {
    // console.log(data.toString());
    if (/waiting for connections on port/.test(data.toString())) {
        /* startup ladder */
        require(global.cwd + '/index');
    }
});

// mock player auth into always returning true
require(global.cwd + '/lib/player/auth');
var auth = require.resolve(global.cwd + '/lib/player/auth');
module._cache[auth].exports = function() {
    return {
        then: function(cb) {
            cb();
        }
    }
}

// directory cleanup
function rm(path) {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file){
            var curPath = path + '/' + file;
            if(fs.lstatSync(curPath).isDirectory()) {
                rm(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
    }
};
