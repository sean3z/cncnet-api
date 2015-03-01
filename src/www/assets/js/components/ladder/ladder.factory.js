angular.module('Ladder').factory('LadderSvc', LadderSvc);

LadderSvc.$inject = ['$http', '$q'];
function LadderSvc($http, $q) {
    var factory = {};
    var url = window.location.protocol +'//'+ window.location.hostname + ':4007/ladder';

    factory.top = function(game) {
        var deferred = $q.defer();

        $http.get(url + '/' + game).then(function(results) {
            deferred.resolve(results.data);
        });

        return deferred.promise;
    };

    return factory;
}
