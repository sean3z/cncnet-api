var request = require('request');

describe('Player Endpoints', function() {

    it('should error (404) if player not found', function(done) {
        request({url: url + '/ladder/ts/player/m30w'}, function(err, res) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('should return an array of players via search', function(done) {
        var options = {
            method: 'POST',
            url: url + '/ladder/tsm/search',
            json: {player: 'kaizen'},
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(body.length).to.equal(1);
            expect(Array.isArray(body)).to.equal(true);
            done();
        });
    });

    it('should error (404) if search is missing criteria', function(done) {
        var options = {
            method: 'POST',
            url: url + '/ladder/ts/search',
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('TS should provide rank for (mod map) players', function(done) {
        request(url + '/ladder/tsm/player/kaizen', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.games.length).to.equal(1);
            expect(body.rank).to.equal(1);
            done();
        });
    });

    it('TS should provide rank for (official) players', function(done) {
        request(url + '/ladder/ts/player/test2', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.games.length).to.equal(1);
            expect(body.rank).to.equal(1);
            done();
        });
    });

    it('RA should provide rank for individual players', function(done) {
        request(url + '/ladder/ra/player/robskate', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.games.length).to.equal(1);
            expect(body.rank).to.equal(1);
            done();
        });
    });

    it('should hide games from player object when query param passed', function(done) {
        request(url + '/ladder/tsm/player/kaizen?games=false', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.games).to.be.undefined;
            expect(body.rank).to.equal(1);
            done();
        });
    });
});
