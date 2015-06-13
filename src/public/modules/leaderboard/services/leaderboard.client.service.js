'use strict';

//LadderSvc service used to communicate Ladder REST endpoints
angular.module('Leaderboard')

    .factory('LadderSvc', ['$http', '$q',
        function ($http, $q) {

            var factory = {};
            var url = window.location.protocol + '//' + window.location.hostname + ':4007/leaderboard';

            factory.top = function (game) {
                var deferred = $q.defer();

                $http.get(url + '/' + game).then(function (results) {
                    deferred.resolve(results.data);
                });

                return deferred.promise;
            };

            return factory;
        }]
);