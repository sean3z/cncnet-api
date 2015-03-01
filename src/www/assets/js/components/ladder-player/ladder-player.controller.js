angular.module('Ladder.Player').controller('LadderPlayerCtrl', LadderPlayerCtrl);

LadderPlayerCtrl.$inject = ['$stateParams'];
function LadderPlayerCtrl($stateParams) {
    var vm = this;
    
    vm.player = $stateParams.player;
    console.log('Player', $stateParams);
}
