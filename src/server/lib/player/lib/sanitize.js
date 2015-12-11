module.exports = function _sanitize(str, strict, repl) {
    var reg = str.toLowerCase().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    if (!repl) {
        if (strict) reg = '^' + reg + '$';
        return new RegExp(reg);
    }
    return reg;
};
