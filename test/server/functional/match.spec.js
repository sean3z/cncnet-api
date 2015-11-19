var request = require('request');

describe('Match Endpoints', function() {
    it('should persist match information', function(done) {
        request(url + '/ladder/ts/game/1554103450', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.players.length).to.equal(2);
            done();
        });
    });

    it('should error (404) when match not found', function(done) {
        request(url + '/ladder/ts/game/000', function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });
});