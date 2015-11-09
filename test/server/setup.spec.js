/* add global wait to startup mongodb */
before(function(done) {
    this.timeout(3000);

    setTimeout(function() {
        done();
    }, 2500);
});

/* teardown mongodb */
after(function() {
    global.mongodb.kill();
});