angular.module('app', ['ui.router']).config(configuration);

function configuration($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: 'assets/html/partials/index-partial.html'
        })

        .state('ladder', {
            url: '/ladder/:game',
            controller: LadderCtrl,
            controllerAs: 'ladderCtrlVm',
            templateUrl: 'assets/html/partials/ladder-partial.html'
        })

        .state('ladder.player', {
            url: '/player/:player',
            controller: LadderPlayerCtrl,
            controllerAs: 'ladderPlayerCtrlVm',
            templateUrl: 'assets/html/partials/ladder-player-partial.html'
        })

        .state('ladder.game', {
            url: '/game/:gameId',
            controller: LadderGameCtrl,
            controllerAs: 'ladderGameCtrlVm',
            templateUrl: 'assets/html/partials/ladder-game-partial.html'
        });

    $urlRouterProvider.otherwise('/index');
}
