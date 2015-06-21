'use strict';

// Ladder controller
angular.module('Leaderboard').controller('LeaderboardController', ['$scope', '$state', '$stateParams', 'LadderSvc',
    function ($scope, $state, $stateParams, LadderSvc) {

        LadderSvc.getTop50($stateParams.game).then(function(response) {
            $scope.players = response;
        console.log($scope.players);
        });

        // Until we have game names in our response
        switch($stateParams.game) {
            case 'ts':
                $scope.game = 'Tiberian Sun';
                break;
            case 'ra':
                $scope.game = 'Red Alert';
                break;
            case 'yr':
                $scope.game = 'Yuri\'s Revenge';
                break;
            default:
                $scope.game = 'Global';
        }
    }
]);

