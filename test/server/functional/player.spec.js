var request = require('request');

describe('Player Endpoints', function() {

    it('should return 404 if player not found', function(done) {
        request({url: url + '/ladder/ts/player/m30w'}, function(err, res) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('should return an array of players via search', function(done) {
        var options = {
            method: 'POST',
            url: url + '/ladder/ts/search',
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
});