angular.module('app', [
    'ui.router',
    'Ladder',
    'Ladder.Game',
    'Ladder.Player'
]);

angular.module('app').config(configuration);

function configuration($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: 'assets/js/components/index/index.partial.html'
        })

        .state('ladder', {
            url: '/ladder/:game',
            controller: 'LadderCtrl',
            controllerAs: 'ladderCtrlVm',
            templateUrl: 'assets/js/components/ladder/ladder.partial.html'
        })

        .state('ladder.player', {
            url: '/player/:player',
            controller: 'LadderPlayerCtrl',
            controllerAs: 'ladderPlayerCtrlVm',
            templateUrl: 'assets/js/components/ladder-player/ladder-player.partial.html'
        })

        .state('ladder.game', {
            url: '/game/:gameId',
            controller: 'LadderGameCtrl',
            controllerAs: 'ladderGameCtrlVm',
            templateUrl: 'assets/js/components/ladder-game/ladder-game.partial.html'
        });

    $urlRouterProvider.otherwise('/index');
}
