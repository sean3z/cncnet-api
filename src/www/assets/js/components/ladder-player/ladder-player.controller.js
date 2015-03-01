angular.module('Ladder.Player').controller('LadderPlayerCtrl', LadderPlayerCtrl);

LadderPlayerCtrl.$inject = ['$stateParams'];
function LadderPlayerCtrl($stateParams) {
    console.log('Player', $stateParams);
}
