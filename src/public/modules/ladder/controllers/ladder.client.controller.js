'use strict';

// Ladder controller
angular.module('Ladder').controller('LadderController', ['$scope', '$state', '$stateParams', 'LadderSvc',
    function ($scope, $state, $stateParams, LadderSvc) {

        console.log('$state', $state);
        console.log('Ladder', $stateParams);
        console.log($scope);

        LadderSvc.top($stateParams.game).then(function(response) {
           $scope.players = response;
        });

        // Test Data to play with UI
        $scope.players = [
            {name: 'Grant', win_count: 50, loss_count: 25, points: 250},
            {name: 'Sean', win_count: 10, loss_count: 55, points: 150}
        ];

    }
]);
