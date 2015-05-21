angular.module('Ladder').controller('LadderCtrl', LadderCtrl);

LadderCtrl.$inject = ['$state', '$stateParams', 'LadderSvc'];
function LadderCtrl($state, $stateParams, LadderSvc) {
    var vm = this;
    
    console.log('$state', $state);
    console.log('Ladder', $stateParams);

    LadderSvc.top($stateParams.game).then(function(response) {
        vm.players = response;
    });
}
