exports.isValid = function(game) {
    if (!game) return false;
    return !!game.match(/td|d2|ra$|ts|fs|ra2|yr/);
};