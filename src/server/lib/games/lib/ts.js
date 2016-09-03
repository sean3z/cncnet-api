var debug = require('debug')('wol:leaderboard');

/* official maps */
var maps = [{
  name: 'A River Runs Near It',
  hash: ''
}, {
  name: 'Casey\'s Canyon',
  hash: ''
}, {
  name: 'Cliffs of Insanity',
  hash: ''
}, {
  name: 'Crater',
  hash: ''
}, {
  name: 'Desolation Redux',
  hash: ''
}, {
  name: 'Dueling Islands',
  hash: ''
}, {
  name: 'Forest Fires',
  hash: ''
}, {
  name: 'Grand Canyon',
  hash: ''
}, {
  name: 'Grassy Knoll',
  hash: ''
}, {
  name: 'Hextreme!',
  hash: ''
}, {
  name: 'Ice Cliffs',
  hash: ''
}, {
  name: 'Limited Access',
  hash: ''
}, {
  name: 'Night of the Mutants',
  hash: ''
}, {
  name: 'No where to run',
  hash: ''
}, {
  name: 'Pentagram',
  hash: ''
}, {
  name: 'Pit Or Plateau',
  hash: ''
}, {
  name: 'Pockets',
  hash: ''
}, {
  name: 'Seismic',
  hash: ''
}, {
  name: 'Sinkholes',
  hash: ''
}, {
  name: 'Storms',
  hash: ''
}, {
  name: 'Stormy Valley',
  hash: ''
}, {
  name: 'Super Bridgehead Redux',
  hash: ''
}, {
  name: 'Tactical Opportunities',
  hash: ''
}, {
  name: 'Terraces',
  hash: ''
}, {
  name: 'The Ice Must Flow',
  hash: ''
}, {
  name: 'Tiberium Garden Redux',
  hash: ''
}, {
  name: 'Tread Lightly',
  hash: ''
}, {
  name: 'Tunnel Train-ing',
  hash: ''
}, {
  name: 'Terraces (TL can Exp) (Air Fix) (Ally)',
  hash: '66071e9c9ee751d79903a7b865e2608a48076145'
}, {
  name: '!Throwback! 0.69 (Ally)(byHumble&Co)',
  hash: 'd945ed13d51cf6f2941a5401e22068d61a711598'
}, {
  name: 'Tiberium Desert (2-4)(Ally) skylegend',
  hash: 'd21f608c18d6d00f7a04daad586b5e2e203938e1'
}, {
  name: 'Forest Fires (Air Fix) (Ally)',
  hash: '74ee488a01a24acedc4783a80e5eecdf879dae43'
}, {
  name: 'Forest Fires (8)(Air Fix)(Ally)(BR RM EDIT)',
  hash: 'a22cbca82b6afd6b91459f8eca2ca77d47175e8a'
}, {
  name: 'Area 51 [6p](TunnelFix)(Ally)',
  hash: 'a25bc7d232cc6b80a92e26d01afde39160b53208'
}];

exports.official = function(settings) {
    settings.official = false;
    /* check if map is official */
    for (var i = 0, x = maps.length; i < x; i++) {
        if (settings.scen == maps[i].name) {
            settings.official = true;
            break;
        }
    }

    return settings;
};
