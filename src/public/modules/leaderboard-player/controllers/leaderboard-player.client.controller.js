'use strict';

// Ladder.Player controller
angular.module('Leaderboard.Player').controller('LeaderboardPlayerController', ['$scope', '$state', '$stateParams', 'LadderPlayerSvc',
    function ($scope, $state, $stateParams, LadderPlayerSvc) {

        $scope.gameName = $stateParams.game;

        LadderPlayerSvc.getPlayer($stateParams.game, $stateParams.player).then(function (response) {
           $scope.player = response;
        });


        ///***
        // * Filter by current player
        // * @param data
        // */
        //$scope.filterByPlayer = function (data) {
        //    angular.forEach(data, function (value, key) {
        //        if (value.name === $stateParams.player) {
        //            $scope.player = value;
        //            console.log(value);
        //            $scope.games = value;
        //        }
        //    });
        //};
    }
]);