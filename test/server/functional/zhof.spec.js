/* DO NOT RENAME - intentionally running last */

describe('HoF Endpoints', function() {

  before(function(done) {
      /* reset ladder */
      request({
        url: url + '/ladder/hof/snapshot',
        qs: {
          pw: 'supersecret'
        }
      }, global.noop);
      
      setTimeout(done, 10);
  });

  it('should leave critical player data intact', function(done) {
    request(url + '/ladder/ts/player/test2', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        body = JSON.parse(body);
        expect(body.games).to.be.empty;
        expect(body.wins).to.equal(0);
        expect(body.losses).to.equal(0);
        expect(body.disconnects).to.equal(0);
        expect(body.points).to.equal(1000);
        expect(body.rank).to.equal(0);

        var date = new Date();
        expect(body.hof[0].month).to.equal(date.getMonth());
        expect(body.hof[0].year).to.equal(date.getFullYear());
        expect(body.hof[0].rank).to.equal(2);
        done();
    });
  });

  it('should save top 10 players per game', function(done) {
    request(url + '/ladder/hof', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      body = JSON.parse(body);
      expect(body.length).to.equal(1);
      expect(body[0].month).to.exist;
      expect(body[0].year).to.exist;
      expect(body[0].ts).to.exist;
      expect(body[0].ra).to.exist;
      done();
    });
  });

  it('should allow us to search hof by month/year', function(done) {
    var date = new Date();
    var query = '?month='+ date.getMonth() + '&year=' + date.getFullYear();
    request(url + '/ladder/hof' + query, function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      body = JSON.parse(body);
      expect(body.length).to.equal(1);
      expect(body[0].month).to.equal(date.getMonth());
      expect(body[0].year).to.equal(date.getFullYear());
      done();
    });
  });

});
