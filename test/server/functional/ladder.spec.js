var fs = require('fs');
var request = require('request');
var MATCH_DELAY = parseInt(process.env.MATCH_DELAY) + 50;

describe('Ladder Endpoints', function() {
    it('RA Regular match: 2 packets', function(done) {
        var robskate = fs.readFileSync(scenarios + '/RA_REGULAR_PLAYER_2');
        var fattynoob = fs.readFileSync(scenarios + '/RA_REGULAR_PLAYER_1');

        var options = {
            method: 'POST',
            url: url + '/ladder/ra',
            body: robskate.toString(),
            headers: {
                'content-type': 'text/plain',
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(202);
        });

        options.body = fattynoob.toString();
        request(options, function(err, res) {
            expect(res.statusCode).to.equal(202);
        });

        setTimeout(function() {
            request({url: url + '/ladder/ra/player/fattynoob'}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.wins).to.equal(0);
                expect(body.losses).to.equal(1);
                expect(body.disconnects).to.equal(0);
                expect(body.games.length).to.equal(1);
                expect(body.points).to.equal(984);
            });

            request({url: url + '/ladder/ra/player/robskate'}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.wins).to.equal(1);
                expect(body.losses).to.equal(0);
                expect(body.disconnects).to.equal(0);
                expect(body.games.length).to.equal(1);
                expect(body.points).to.equal(1016);
                done();
            });
        }, MATCH_DELAY);
    });
    it('TS Regular match: 2 packets', function(done) {
        var gameranger = fs.readFileSync(scenarios + '/TS_REGULAR_PLAYER_2');
        var kaizen = fs.readFileSync(scenarios + '/TS_REGULAR_PLAYER_1');

        var options = {
            method: 'POST',
            url: url + '/ladder/ts',
            body: gameranger.toString(),
            headers: {
                'content-type': 'text/plain',
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(202);
        });

        options.body = kaizen.toString();
        request(options, function(err, res) {
            expect(res.statusCode).to.equal(202);
        });

        setTimeout(function() {
            request({url: url + '/ladder/ts/player/gameranger'}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.wins).to.equal(0);
                expect(body.losses).to.equal(1);
                expect(body.disconnects).to.equal(0);
                expect(body.games.length).to.equal(1);
                expect(body.points).to.equal(984);
            });

            request({url: url + '/ladder/ts/player/kaizen'}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.wins).to.equal(1);
                expect(body.losses).to.equal(0);
                expect(body.disconnects).to.equal(0);
                expect(body.games.length).to.equal(1);
                expect(body.points).to.equal(1016);
                done();
            });
        }, MATCH_DELAY);
    });

    it('TS D/C Scenario: 1 packet declare uploader winner', function(done) {
        var results = fs.readFileSync(scenarios + '/TS_DISCONNECT_PLAYER_1');

        var options = {
            method: 'POST',
            url: url + '/ladder/ts',
            body: results.toString(),
            headers: {
                'content-type': 'text/plain',
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(202);
        });

        setTimeout(function() {
            request({url: url + '/ladder/ts/player/xy'}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.wins).to.equal(0);
                expect(body.losses).to.equal(1);
                expect(body.disconnects).to.equal(1);
                expect(body.games.length).to.equal(1);
                expect(body.points).to.equal(984);
            });

            request({url: url + '/ladder/ts/player/test2'}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.wins).to.equal(1);
                expect(body.losses).to.equal(0);
                expect(body.disconnects).to.equal(0);
                expect(body.games.length).to.equal(1);
                expect(body.points).to.equal(1016);
                done();
            });
        }, MATCH_DELAY);
    });

    it('TS Conflicting packets: consider match out of sync', function(done) {
        var wolfhound = fs.readFileSync(scenarios + '/TS_CONFLICT_PLAYER_2');
        var puzzibaer = fs.readFileSync(scenarios + '/TS_CONFLICT_PLAYER_1');

        var options = {
            method: 'POST',
            url: url + '/ladder/ts',
            body: wolfhound.toString(),
            headers: {
                'content-type': 'text/plain',
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(202);
        });

        options.body = puzzibaer.toString();
        request(options, function(err, res) {
            expect(res.statusCode).to.equal(202);
        });

        setTimeout(function() {
            request({url: url + '/ladder/ts/player/puzzibaer'}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.wins).to.equal(0);
                expect(body.losses).to.equal(0);
                expect(body.disconnects).to.equal(0);
                expect(body.oos).to.equal(1);
                expect(body.games.length).to.equal(1);
                expect(body.points).to.equal(1000);
            });

            request({url: url + '/ladder/ts/player/wolfhound'}, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.wins).to.equal(0);
                expect(body.losses).to.equal(0);
                expect(body.disconnects).to.equal(0);
                expect(body.oos).to.equal(1);
                expect(body.games.length).to.equal(1);
                expect(body.points).to.equal(1000);
                done();
            });
        }, MATCH_DELAY);
    });

    it('should provide TS leaderboard for players', function(done) {
        /* warm up cache */
        request(url + '/ladder/ts', function() {});

        /* actual results */
        setTimeout(function() {
            request(url + '/ladder/ts', function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.length).to.equal(6);
                done();
            });
        }, MATCH_DELAY);
    });

});