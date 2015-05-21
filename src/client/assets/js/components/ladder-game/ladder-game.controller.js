angular.module('Ladder.Game').controller('LadderGameCtrl', LadderGameCtrl);

LadderGameCtrl.$inject = ['$stateParams'];
function LadderGameCtrl($stateParams) {
    console.log('Game', $stateParams);
}
