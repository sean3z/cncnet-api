angular.module('Ladder').controller('LadderCtrl', LadderCtrl);

LadderCtrl.$inject = ['$state', '$stateParams', 'LadderSvc'];
function LadderCtrl($state, $stateParams, LadderSvc) {
    console.log('$state', $state);
    console.log('Ladder', $stateParams);

    LadderSvc.top($stateParams.game).then(function(response) {
        console.log('response', response);
    });
}
