module.exports = function _sanitize(str, strict) {
    var reg = str.toLowerCase().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    if (strict) reg = '^' + reg + '$';
    return new RegExp(reg);
};
