'use strict';

// Ladder controller
angular.module('Leaderboard.Player').controller('LeaderboardPlayerController', ['$scope', '$state', '$stateParams',
    function ($scope, $state, $stateParams) {

        console.log('We are at player detail');

        // Todo: Fetch player stats, and push into object

        // Example object
        $scope.player = {
            name: $stateParams.player,
            rank: 30,
            wins: 25,
            losses: 10,
            points: 250
        };

    }
]);





