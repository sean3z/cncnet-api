'use strict';

// Ladder controller
angular.module('Leaderboard').controller('LeaderboardController', ['$scope', '$state', '$stateParams', 'LadderSvc',
    function ($scope, $state, $stateParams, LadderSvc) {

        LadderSvc.getTop50($stateParams.game).then(function(response) {
            $scope.players = response;
        });
    }
]);

