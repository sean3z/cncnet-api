module.exports = function(req, res) {
    /* intentionally throwing into event loop */
    setTimeout(function() {
        res.send('pong');
    }, 1);
};