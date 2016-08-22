/* DO NOT RENAME - intentionally running between match.spec and player.spec */

var request = require('request');

describe('Clan Endpoints', function() {
    it('Info: should error (404) if clan not found', function(done) {
        request({url: url + '/ladder/ts/clan/m30w'}, function(err, res) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('Create: should error (401) if no auth provided', function(done) {
        var options = {
            method: 'PUT',
            url: url + '/ladder/ts/clan/TXz',
            json: {player: 'test2'},
            headers: {
            }
        };

        request(options, function(err, res, body) {
            expect(res.statusCode).to.equal(401);
            done();
        });
    });

    it('Create: should error (400) if missing clan or player', function(done) {
        var options = {
            method: 'PUT',
            url: url + '/ladder/ts/clan/',
            json: {player: 'test2'},
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res, body) {
            expect(res.statusCode).to.equal(400);

            var options = {
                method: 'PUT',
                url: url + '/ladder/ts/clan/TXz',
                json: {player: ''},
                headers: {
                    authorization: 'Basic dGFoajpwYXNzd29yZA=='
                }
            };

            request(options, function(err, res, body) {
                expect(res.statusCode).to.equal(400);
                done();
            });
        });
    });

    it('Create: should allow users to create clan', function(done) {
        var options = {
            method: 'PUT',
            url: url + '/ladder/ts/clan/TXz',
            json: {player: 'test2'},
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res, body) {
            expect(res.statusCode).to.equal(200);

            request(url + '/ladder/ts/player/test2', function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body);
                expect(body.clan).to.equal('TXz');
                done();
            });
        });
    });

    it('Info: should expose information about existing clans', function(done) {
        request({url: url + '/ladder/ts/clan/TXz'}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);
            expect(body.name).to.equal('txz');
            expect(body.nam).to.equal('TXz');
            expect(body.founder).to.equal('test2');
            expect(body.members.length).to.equal(1);
            done();
        });
    });

    it('Info: should error (400) if missing clan', function(done) {
        request({url: url + '/ladder/ts/clan/'}, function(err, res, body) {
            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    it('Create: should error (400) if player already in clan', function(done) {
        var options = {
            method: 'PUT',
            url: url + '/ladder/ts/clan/StK',
            json: {player: 'test2'},
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res, body) {
            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    it('Create: should error (400) if clan already exists', function(done) {
        var options = {
            method: 'PUT',
            url: url + '/ladder/ts/clan/TXz',
            json: {player: 'xy'},
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res, body) {
            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    it('Destroy: should error (401) if no auth provided', function(done) {
        var options = {
            method: 'DELETE',
            url: url + '/ladder/ts/clan/TXz',
            json: {player: 'test2'},
            headers: {
            }
        };

        request(options, function(err, res, body) {
            expect(res.statusCode).to.equal(401);
            done();
        });
    });

    it('Destroy: should error (400) if player not in clan', function(done) {
        var options = {
            method: 'DELETE',
            url: url + '/ladder/ts/clan/TXz',
            json: {player: 'xy'},
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    it('Destroy: should allow founders to delete clan', function(done) {
        var options = {
            method: 'DELETE',
            url: url + '/ladder/ts/clan/TXz',
            json: {player: 'test2'},
            headers: {
                authorization: 'Basic dGFoajpwYXNzd29yZA=='
            }
        };

        request(options, function(err, res) {
            expect(res.statusCode).to.equal(200);

            request({url: url + '/ladder/ts/clan/TXz'}, function(err, res) {
                expect(res.statusCode).to.equal(404);

                request(url + '/ladder/ts/player/test2', function(err, res, body) {
                    expect(res.statusCode).to.equal(200);
                    body = JSON.parse(body);
                    expect(body.clan).to.be.undefined;
                    done();
                });
            });
        });
    });
});