angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'Ladder'
]);

angular.module('app').config(configuration);

function configuration($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/index',
            template: '<h3>Hey index</h3>'
        })

        .state('ladder', {
            url: '/ladder/:game',
            templateUrl: 'modules/ladder/views/list-ladder.client.view.html',
            controller: 'LadderController'
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