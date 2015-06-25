angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'mgcrea.ngStrap',
    'Leaderboard',
    'Leaderboard.Player'
]);

angular.module('app').config(configuration);

function configuration($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: 'modules/home/views/list-home.client.view.html'
        })

        .state('leaderboard', {
            url: '/leaderboard/:game',
            templateUrl: 'modules/leaderboard/views/list-leaderboard.client.view.html'
        })

        .state('leaderboard.player', {
            url: '/player/:player',
            templateUrl: 'modules/leaderboard-player/views/detail-leaderboard-player.client.view.html'
        });


        //.state('ladder.game', {
        //    url: '/game/:gameId',
        //    controller: 'LadderGameCtrl',
        //    controllerAs: 'ladderGameCtrlVm',
        //    templateUrl: 'assets/js/components/ladder-game/ladder-game.partial.html'
        //});

    $urlRouterProvider.otherwise('/index');
}