'use strict';

// Ladder.Player controller
angular.module('Leaderboard.Player').controller('LeaderboardPlayerController', ['$scope', '$state', '$stateParams', 'LadderPlayerSvc',
    function ($scope, $state, $stateParams, LadderPlayerSvc) {

        $scope.gameName = $stateParams.game;

        LadderPlayerSvc.getPlayer($stateParams.game, $stateParams.player).then(function (response) {
           $scope.player = response;
        });

    }
]);