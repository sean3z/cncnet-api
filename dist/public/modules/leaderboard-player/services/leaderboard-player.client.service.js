'use strict';

//LadderSvc service used to communicate Ladder REST endpoints
angular.module('Leaderboard.Player')

    .factory('LadderPlayerSvc', ['$http', '$q',
        function ($http, $q) {
            return {
                getPlayer: function (game, player) {
                    var deferred = $q.defer(),
                        url = "http://tahj.cncnet.org:4007/ladder";

                    $http.jsonp(url + '/' + game + '/player/' + player + '?callback=JSON_CALLBACK')
                        .success(function (data) {
                            return deferred.resolve(data);
                        })
                        .error(function (data) {
                            deferred.reject(status);
                        });
                    return deferred.promise;
                }
            }
        }]
);