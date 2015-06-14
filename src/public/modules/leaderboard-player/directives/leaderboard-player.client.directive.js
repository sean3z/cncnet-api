angular.module('Leaderboard.Player', ['ui.router', 'helloWorld'])

.directive('helloWorld', function() {
    return {
        restrict: 'AE',
        template: '<h3>Hello World!!</h3>'
    };
});

