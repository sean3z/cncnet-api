/* WOL fields that should be in match.settings object */

module.exports = [
    'sped', /* (int) match speed */
    'plrs', /* (int) number of players in match (>= ts) */
    'nump', /* (int) number of players in match (< ts) */
    'scen', /* (int) match scenario */
    'tech', /* (int) match tech level */
    'unit', /* (int) number of starting units */
    'flag', /* (bool) capture the flag enabled */
    'shad', /* (bool) fog of war enabled */
    'crat', /* (bool) crates enabled */
    'tibr', /* (bool) tiberium enabled */
    'base', /* (bool) bases enabled */
    'cred', /* (int) starting credits */
    'trny', /* (bool) tournament game */
    'shrt', /* (bool) short game enabled */
    'supr', /* (bool) super weapons enabled */
    'aipl' /* (int) number of AI players */
];
