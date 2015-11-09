var fs = require('fs');

describe('Ladder Endpoints', function() {
    it('should return a 400 if missing body', function(done) {
        var options = {
            method: 'POST',
            url: 'http://localhost:4007/ladder/ts'
        };

        request(options, function(err, res, body) {
            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    it('should accept TS game results', function(done) {
        var results = fs.readFileSync(scenarios + '/TS_REGULAR_PLAYER_1');

        var options = {
            method: 'POST',
            url: 'http://localhost:4007/ladder/ts',
            body: results.toString()
        };

        request(options, function(err, res, body) {
            expect(res.statusCode).to.equal(202);
            done();
        });
    });
});