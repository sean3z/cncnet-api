var fs = require('fs');
var request = require('request');
var MATCH_DELAY = process.env.MATCH_DELAY + 3;

describe('Ladder Endpoints', function() {
    it('Regular match: 2 packets', function(done) {
        var america = fs.readFileSync(scenarios + '/TS_REGULAR_PLAYER_2');

        var options = {
            method: 'POST',
            url: url + '/ladder/ts',
            body: america.toString(),
            headers: {
                'content-type': 'text/plain',
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(202);

            var kaizen = fs.readFileSync(scenarios + '/TS_REGULAR_PLAYER_1');
            options.body = kaizen.toString();

            request(options, function(err, res) {
                expect(res.statusCode).to.equal(202);

                setTimeout(function() {
                    request({url: url + '/ladder/ts/player/america'}, function(err, res, body) {
                        expect(res.statusCode).to.equal(200);
                        body = JSON.parse(body);
                        expect(body.wins).to.equal(0);
                        expect(body.losses).to.equal(1);
                        expect(body.disconnects).to.equal(0);
                        expect(body.games.length).to.equal(1);
                        expect(body.points).to.equal(984);

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
                    });
                }, MATCH_DELAY);
            });
        });
    });

    it('D/C Scenario: 1 packet declare uploader winner', function(done) {
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

            setTimeout(function() {
                request({url: url + '/ladder/ts/player/xy'}, function(err, res, body) {
                    expect(res.statusCode).to.equal(200);
                    body = JSON.parse(body);
                    expect(body.wins).to.equal(0);
                    expect(body.losses).to.equal(1);
                    expect(body.disconnects).to.equal(1);
                    expect(body.games.length).to.equal(1);
                    expect(body.points).to.equal(984);

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
                });
            }, MATCH_DELAY);
        });
    });

    it('should provide leaderboard for players', function(done) {
        /* warm up cache */
        request(url + '/ladder/ts', function() {});

        /* actual results */
        setTimeout(function() {
            request(url + '/ladder/ts', function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.length).to.equal(4);
                done();
            });
        }, MATCH_DELAY + 3);
    });

    it('should provide rank for individual players', function(done) {
        request(url + '/ladder/ts/player/kaizen', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.games.length).to.equal(1);
            expect(body.rank).to.equal(1);
            done();
        });
    });

    it('should hide games from player object when query param passed', function(done) {
        request(url + '/ladder/ts/player/kaizen?games=false', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.games).to.be.undefined;
            expect(body.rank).to.equal(1);
            done();
        });
    });

});