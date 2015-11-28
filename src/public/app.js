angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'mgcrea.ngStrap',
    'index',
    'Leaderboard',
    'Leaderboard.Player',
    'Champions'
]);

angular.module('app').config(configuration);

function configuration($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: 'modules/home/views/list-home.client.view.html'
        })

        .state('download', {
            url: '/download',
            templateUrl: 'modules/home/views/list-download.client.view.html'
        })

        .state('leaderboard', {
            url: '/:game',
            templateUrl: 'modules/leaderboard/views/list-leaderboard.client.view.html'
        })

        .state('leaderboard.player', {
            url: '/player/:player',
            templateUrl: 'modules/leaderboard-player/views/detail-leaderboard-player.client.view.html'
        })

        .state('champions', {
            url: '/champions/:game',
            templateUrl: 'modules/champions/views/list-champions.client.view.html'
        });

    $urlRouterProvider.otherwise('/index');
    //$locationProvider.html5Mode(true).hashPrefix('!'); // todo: rewrite server side too...
}
