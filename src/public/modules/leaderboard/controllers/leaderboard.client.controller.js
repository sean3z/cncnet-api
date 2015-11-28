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
                $scope.abbr = 'ts';
                $scope.game = 'Tiberian Sun';
                break;
            case 'tsm':
                $scope.abbr = 'ts';
                $scope.game = 'Tiberian Sun - (mod maps)';
                break;
            case 'ra':
                $scope.abbr = 'ra';
                $scope.game = 'Red Alert';
                break;
            case 'yr':
                $scope.abbr = 'yr';
                $scope.game = 'Yuri\'s Revenge';
                break;
            case 'fs':
                $scope.abbr = 'fs';
                $scope.game = 'Firestorm';
                break;
            case 'am':
                $scope.abbr = 'am';
                $scope.game = 'Aftermath';
                break;
            case 'ra2':
                $scope.abbr = 'ra2';
                $scope.game = 'Red Alert 2';
                break;
            case 'dta':
                $scope.abbr = 'dta';
                $scope.game = 'The Dawn of the Tiberium Age';
                break;
            default:
                $scope.game = 'Global';
        }
    }
]);

