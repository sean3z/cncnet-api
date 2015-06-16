'use strict';

// Ladder controller
angular.module('Leaderboard.Player').controller('LeaderboardPlayerController', ['$scope', '$state', '$stateParams', '$modal',
    function ($scope, $state, $stateParams, $modal) {

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

        $scope.data =  [
            ['Firefox', 45.0],
            ['IE', 26.8],
            ['Chrome', 12.8],
            ['Safari', 8.5],
            ['Opera', 6.2],
            {
                name: 'Others',
                y: 0.7,
                dataLabels: {
                    enabled: false
                }
            }
        ];
        $scope.items = ['item1', 'item2', 'item3'];

        $scope.animationsEnabled = true;

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/leaderboard-player/views/test.html',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    }
]);





