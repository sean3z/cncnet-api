/* WOL fields that should be grouped in match.client object */

module.exports = [
    'vers', /* (str) game client version */
    'vidm', /* (int) client's available video memory */
    'memo', /* (int) client's available pc memory */
    'proc', /* (str) client's processcor family (defunct) */
    'afps', /* (int) average frames per second for match */
    'oosy', /* (bool) whether match was out of sync */
    'gsku', /* (int) game sku */
    'spid', /* (int) sender id? */
    'accn', /* (str) nick of packet sender */
    'nick', /* (str) forum account of packet sender */
    'cmpl', /* (int) match completion status */
    'quit', /* (bool) whether the player quit */
    'unid'
];
