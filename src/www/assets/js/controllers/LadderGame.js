angular.module('Ladder.Game', ['ui.router']).controller('LadderGameCtrl', LadderGameCtrl);

LadderGameCtrl.$inject = ['$stateParams'];
function LadderGameCtrl($stateParams) {
    console.log('Game', $stateParams);
}
