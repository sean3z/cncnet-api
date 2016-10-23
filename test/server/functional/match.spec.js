var request = require('request');

describe('Match Endpoints', function() {
    it('TS should persist (mod map) match information', function(done) {
        request(url + '/ladder/tsm/game/1554103450', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.players.length).to.equal(2);
            expect(body.settings.official).to.equal(false);
            done();
        });
    });

    it('TS should persist (official) match information', function(done) {
        request(url + '/ladder/ts/game/799032354', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.players.length).to.equal(2);
            expect(body.settings.official).to.equal(true);
            done();
        });
    });

    it('should maintain player point/exp information', function(done) {
        request(url + '/ladder/tsm/game/1554103450', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.players.length).to.equal(2);
            expect(body.players[0].exp).to.equal(16);
            expect(body.players[0].points).to.equal(1000);
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
