'use strict';

// Ladder.Player controller
angular.module('Leaderboard.Player').controller('LeaderboardPlayerController', ['$scope', '$state', '$stateParams', 'LadderSvc',
    function ($scope, $state, $stateParams, LadderSvc) {

        LadderSvc.getTop50($stateParams.game).then(function (response) {
            $scope.filterByPlayer(response);
        });

        /***
         * Filter by current player
         * @param data
         */
        $scope.filterByPlayer = function (data) {
            angular.forEach(data, function (value, key) {
                if (value.name === $stateParams.player) {
                    $scope.player = value;
                    $scope.games = value.games;
                }
            });
        };
    }
]);