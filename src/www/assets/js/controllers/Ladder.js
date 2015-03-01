angular.module('Ladder', ['ui.router']).controller('LadderCtrl', LadderCtrl);

LadderCtrl.$inject = ['$state', '$stateParams'];
function LadderCtrl($state, $stateParams) {
    console.log('$state', $state);
    console.log('Ladder', $stateParams);
}
