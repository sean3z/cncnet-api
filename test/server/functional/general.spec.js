describe('General Endpoints', function() {
    it('should respond to ping requests', function(done) {
        request(url + '/ping', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('"pong"');
            done();
        });
    });

    it('should response to ladder requests', function(done) {
        request(url + '/ladder/ts', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('[]');
            done();
        });
    })
});

