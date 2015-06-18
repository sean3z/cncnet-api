'use strict';

// Ladder controller
angular.module('Leaderboard').controller('LeaderboardController', ['$scope', '$state', '$stateParams', 'LadderSvc',
    function ($scope, $state, $stateParams, LadderSvc) {

        console.log('$state', $state);
        console.log('Leaderboard', $stateParams);

        LadderSvc.top($stateParams.game).then(function(response) {
           $scope.players = response;
        });

        $scope.limit = 10;

        // Test Data to play with UI
        $scope.players =
        [
            {name: 'Grant', win_count: 50, loss_count: 25, points: 355},
            {name: 'tahj', win_count: 10, loss_count: 55, points: 21},
            {name: 'funkyfr3sh', win_count: 50, loss_count: 25, points: 3},
            {name: 'iran', win_count: 215, loss_count: 25, points: 250},
            {name: 'hifi', win_count: 55, loss_count: 25, points: 5},
            {name: 'cchyper', win_count: 50, loss_count: 25, points: 2},
            {name: 'myg', win_count: 25, loss_count: 25, points: 3},
            {name: 'tore', win_count: 50, loss_count: 25, points: 55},
            {name: 'rockers', win_count: 3, loss_count: 25, points: 5},
            {name: 'lolipopladyman', win_count: 50, loss_count: 25, points: 35},
            {name: 'rocking', win_count: 50, loss_count: 25, points: 45},
            {name: 'crackers', win_count: 50, loss_count: 25, points: 26},
            {name: 'badstuff', win_count: 50, loss_count: 25, points: 27},
            {name: 'statwhore', win_count: 50, loss_count: 25, points: 16},
            {name: 'loveW1nning', win_count: 50, loss_count: 25, points: 16},
            {name: 'ojset1o5j', win_count: 50, loss_count: 25, points: 6},
            {name: 'theRock24', win_count: 10, loss_count: 55, points: 3}
        ];
    }
]);
