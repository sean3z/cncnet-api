var request = require('request');

describe('Auth Endpoints', function() {
    it('should allow user creation', function(done) {
        var options = {
            method: 'PUT',
            url: url + '/auth/tahj',
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        }

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should return (401) if using same username (diff pass & nick)', function(done) {
        var options = {
            method: 'PUT',
            url: url + '/auth/sean3z',
            headers: {
                authorization: 'Basic dGFoajp6eW9zMQ=='
            }
        }

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(401);
            done();
        });
    });

    it('should return (401) if user does not exist but nick belongs to another user', function(done) {
        var options = {
            method: 'PUT',
            url: url + '/auth/tahj',
            headers: {
                authorization: 'Basic dGFhc2RmaGo6enlvczE='
            }
        }

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(401);
            done();
        });
    });

    it.skip('should return (409) if user already exists', function(done) {
        var options = {
            method: 'PUT',
            url: url + '/auth/tahj',
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        }

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(409);
            done();
        });
    });

    it('should return (200) when retrieving existing users', function(done) {
        var options = {
            method: 'GET',
            url: url + '/auth/tahj',
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it.skip('should return (404) if user doesn\'t exist', function(done) {
        var options = {
            method: 'GET',
            url: url + '/auth/someuser',
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('should return (200) if auth request is missing player', function(done) {
        var options = {
            method: 'GET',
            url: url + '/auth/',
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should error (401) if credentials are incorrect', function(done) {
        var options = {
            method: 'GET',
            url: url + '/auth/tahj',
            headers: {
                authorization: 'Basic AZy92dzNXYwpjaoFGd=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(401);
            done();
        });
    });

    it('should error (401) if credentials are incorrect (without player)', function(done) {
        var options = {
            method: 'GET',
            url: url + '/auth/',
            headers: {
                authorization: 'Basic AZy92dzNXYwpjaoFGd=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(401);
            done();
        });
    });

    it('should error (401) if auth request missing credentials', function(done) {
        request(url + '/auth/tahj', function(err, res) {
            expect(res.statusCode).to.equal(401);
            done();
        });
    });
});

