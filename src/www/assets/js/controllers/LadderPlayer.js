angular.module('Ladder.Player', ['ui.router']).controller('LadderPlayerCtrl', LadderPlayerCtrl);

LadderPlayerCtrl.$inject = ['$stateParams'];
function LadderPlayerCtrl($stateParams) {
    console.log('Player', $stateParams);
}
