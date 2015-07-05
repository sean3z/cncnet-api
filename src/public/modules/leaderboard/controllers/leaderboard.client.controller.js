'use strict';

// Ladder controller
angular.module('Leaderboard').controller('LeaderboardController', ['$scope', '$state', '$stateParams', 'LadderSvc', 'PlayerSearch',
    function ($scope, $state, $stateParams, LadderSvc, PlayerSearch) {

        LadderSvc.getTop50($stateParams.game).then(function(response) {
            $scope.players = response;
        });

        // Search by player name
        $scope.searchByPlayer = function(){
            if($stateParams.game){
                PlayerSearch.byPlayer($stateParams.game, $scope.search.name).then(function (response) {
                    $scope.searchResults = response;
                });
            }
        };

        // Until we have game names in our response
        switch($stateParams.game) {
            case 'ts':
                $scope.image = 'ts';
                $scope.game = 'Tiberian Sun';
                break;
            case 'ra':
                $scope.image = 'ra';
                $scope.game = 'Red Alert';
                break;
            case 'yr':
                $scope.image = 'yr';
                $scope.game = 'Yuri\'s Revenge';
                break;
            default:
                $scope.game = 'Global';
        }
    }
]);

