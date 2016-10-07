/* WOL fields that should be grouped in match.client object */

module.exports = [
    'vers', /* (str) game client version */
    'vidm', /* (int) client's available video memory */
    'memo', /* (int) client's available pc memory */
    'proc', /* (str) client's processor family (defunct) */
    'afps', /* (int) average frames per second for match */
    'oosy', /* (bool) whether match was out of sync */
    'gsku', /* (int) game sku */
    'spid', /* (int) sender id? */
    'accn', /* !(str) nick of packet sender */
    'nick', /* !(str) forum account of packet sender */
    'cmpl', /* (int) match completion status */
    'sdfx', /* !(bool) sudden disconnect from game  */
    'quit', /* (bool) whether the player quit */
    'fini', /* (bool) whether player saw game completion */
    'myid', /* !(int) index of uploader in player array */
    'pils', /* !(int) player ping connectivity streak */
    'para', /* !(bool) player aborted recon attempt */
    'myip', /* !(str) player's remote address */
    'wine', /* !(bool) player is using wine */
    'utcd', /* !(str) system time settings */
    'cult', /* !(str) player's OS language */
    'pngr', /* (int) YR: pings recieved */
    'pngs', /* (int) YR: pings sent */
    'unid'
];
