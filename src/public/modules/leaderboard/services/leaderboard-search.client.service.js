'use strict';

//LadderSvc service used to communicate Ladder REST endpoints
angular.module('Leaderboard')

    .factory('PlayerSearch', ['$http', '$q',
        function ($http, $q) {
            return {
                byPlayer: function (game, name) {
                    var deferred = $q.defer(),
                    url = "http://tahj.cncnet.org:4007/ladder";
                    $http.post(url + '/' + game + '/' + 'search', { "player": name})
                        .success(function (data, status, headers, config) {
                            return deferred.resolve(data);
                        }).error(function (data, status, headers, config) {
                            console.log(status);
                        });
                    return deferred.promise;
                }
            }
        }]
);