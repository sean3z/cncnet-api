var basicAuth = require('basic-auth');

exports.player = function(req, res, next) {
    var credentials = basicAuth(req);
    
    console.log(credentials);
    
    if (!credentials || credentials.name !== 'john' || credentials.pass !== 'secret') {
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="example"'
        });
        res.end();
    } else {
        res.json({test: 'meow'});
    }
    
};
