'use strict';

// Ladder controller
angular.module('index').controller('HomeController', ['$scope', '$state', '$stateParams', 'LadderSvc', 'PlayerSearch',
    function ($scope, $state, $stateParams, LadderSvc) {

        // Its a little hacky, but will do for now
        var games = ['ts', 'fs', 'ra', 'am'];

        $scope.top5 = {
            ts: '',
            fs: '',
            ra: '',
            am: ''
        };

        games.forEach(function (key) {
            LadderSvc.getTop50(key).then(function (response) {
                $scope.top5[key] = response;
            });
        });
    }
]);
