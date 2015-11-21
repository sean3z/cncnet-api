var debug = require('debug')('wol:leaderboard');

var official_maps = [
    'A River Runs Near It',
    'Casey\'s Canyon',
    'Cliffs of Insanity',
    'Desolation Redux',
    'Dueling Islands',
    'Forest Fires',
    'Grand Canyon',
    'Grassy Knoll',
    'Hextreme!',
    'Ice Cliffs',
    'Limited Access',
    'Night of the Mutants',
    'No where to run',
    'Pentagram',
    'Pit Or Plateau',
    'Pockets',
    'Seismic',
    'Sinkholes',
    'Storms',
    'Stormy Valley',
    'Super Bidgehead Redux',
    'Tactical Opportunities',
    'Terraces',
    'The Ice Must Flow',
    'Tiberium Garden Redux',
    'Tread Lightly',
    'Tunnel Training'
];

exports.official = function(settings) {
    /* check if map is official */
    for(var i = 0, x = official_maps.length; i < x; i++) {
        if (settings.scen == official_maps[i]) {
            settings.official = true;
            break;
        }
    }

    return settings;
};
