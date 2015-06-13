angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'Leaderboard'
]);

angular.module('app').config(configuration);

function configuration($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/index',
            template: '<h3>Hey index</h3>'
        })

        .state('leaderboard', {
            url: '/leaderboard/:game',
            templateUrl: 'modules/leaderboard/views/list-leaderboard.client.view.html',
            controller: 'LeaderboardController'
        });

        //.state('ladder.player', {
        //    url: '/player/:player',
        //    controller: 'LadderPlayerCtrl',
        //    controllerAs: 'ladderPlayerCtrlVm',
        //    templateUrl: 'assets/js/components/ladder-player/ladder-player.partial.html'
        //})
        //
        //.state('ladder.game', {
        //    url: '/game/:gameId',
        //    controller: 'LadderGameCtrl',
        //    controllerAs: 'ladderGameCtrlVm',
        //    templateUrl: 'assets/js/components/ladder-game/ladder-game.partial.html'
        //});

    $urlRouterProvider.otherwise('/index');
}