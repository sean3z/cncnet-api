'use strict';

//LadderSvc service used to communicate Ladder REST endpoints
angular.module('index')

    .factory('LadderSvc', ['$http', '$q',
        function ($http, $q) {
            return {
                getTop50: function (game) {
                    var deferred = $q.defer(),
                        url = "http://api.cncnet.org:4007/ladder";

                    $http.jsonp(url + '/' + game + '?callback=JSON_CALLBACK')
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