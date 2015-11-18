var fs = require('fs');

describe('General Endpoints', function() {
    it('should respond to ping requests', function(done) {
        request(url + '/ping', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('"pong"');
            done();
        });
    });

    it('should respond to ladder requests', function(done) {
        request(url + '/ladder/ts', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('[]');
            done();
        });
    });

    it('should error (400) if missing body from game results', function(done) {
        var options = {
            method: 'POST',
            url: url + '/ladder/ts',
            headers: {
                'content-type': 'text/plain',
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    it('should error (401) if missing authorization header', function(done) {
        var results = fs.readFileSync(scenarios + '/TS_REGULAR_PLAYER_1');

        var options = {
            method: 'POST',
            url: url + '/ladder/ts',
            body: results.toString(),
            headers: {
                'content-type': 'text/plain'
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(401);
            done();
        });
    });

    it('should accept game results', function(done) {
        var results = fs.readFileSync(scenarios + '/TS_REGULAR_PLAYER_1');

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
            done();
        });
    });
});

