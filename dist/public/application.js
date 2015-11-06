angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'mgcrea.ngStrap',
    'index',
    'Leaderboard',
    'Leaderboard.Player'
]);

angular.module('app').config(configuration);

function configuration($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: 'modules/home/views/list-home.client.view.html'
        })

        .state('download', {
            url: '/download',
            templateUrl: 'modules/home/views/list-download.client.view.html'
        })

        .state('leaderboard', {
            url: '/:game',
            templateUrl: 'modules/leaderboard/views/list-leaderboard.client.view.html'
        })

        .state('leaderboard.player', {
            url: '/player/:player',
            templateUrl: 'modules/leaderboard-player/views/detail-leaderboard-player.client.view.html'
        });

    $urlRouterProvider.otherwise('/index');
    //$locationProvider.html5Mode(true).hashPrefix('!'); // todo: rewrite server side too...
}
configuration.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
angular.module('index', ['ui.router']);
angular.module('Leaderboard.Player', ['ui.router']);
angular.module('Leaderboard', ['ui.router']);
'use strict';

// Ladder controller
angular.module('index').controller('HomeController', ['$scope', '$state', '$stateParams', 'LadderSvc', 'PlayerSearch',
    function ($scope, $state, $stateParams, LadderSvc) {

        // Its a little hacky, but will do for now
        var games = ['ts', 'fs', 'ra', 'am'];

        $scope.top5 = {
            ts: '',
            fs: '',
            ra: '',
            am: ''
        };

        games.forEach(function (key) {
            LadderSvc.getTop50(key).then(function (response) {
                $scope.top5[key] = response;
            });
        });
    }
]);

'use strict';

//LadderSvc service used to communicate Ladder REST endpoints
angular.module('index')

    .factory('LadderSvc', ['$http', '$q',
        function ($http, $q) {
            return {
                getTop50: function (game) {
                    var deferred = $q.defer(),
                        url = "http://api.cncnet.org:4007/ladder";

                    $http.jsonp(url + '/' + game + '?callback=JSON_CALLBACK')
                        .success(function (data) {
                            return deferred.resolve(data);
                        })
                        .error(function (data) {
                            deferred.reject(status);
                        });
                    return deferred.promise;
                }
            }
        }]
);
'use strict';

// Ladder.Player controller
angular.module('Leaderboard.Player').controller('LeaderboardPlayerController', ['$scope', '$state', '$stateParams', 'LadderPlayerSvc',
    function ($scope, $state, $stateParams, LadderPlayerSvc) {

        console.log('hi');
        $scope.gameName = $stateParams.game;

        LadderPlayerSvc.getPlayer($stateParams.game, $stateParams.player).then(function (response) {
           $scope.player = response;
        });

        console.log($stateParams);

    }
]);
angular.module('Leaderboard.Player').directive('playerChart', [function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },

        link: function (scope, element, attrs) {
            scope.$watch('data', function (newValue) {
                if(newValue){
                    drawChart();
                }
            }, true);

            var drawChart = function() {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: element[0],
                        backgroundColor:'rgba(255, 255, 255, 0)',
                        plotBackgroundColor: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: 'Browser<br>shares',
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 50
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true,
                                distance: -50,
                                style: {
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '0px 1px 2px black'
                                }
                            },
                            startAngle: -90,
                            endAngle: 90,
                            center: ['50%', '75%']
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Browser share',
                        innerSize: '50%',
                        data: scope.data
                    }]
                });
            };

        },

        template: '<div>Error</div>'
    }
}]);
angular.module('Leaderboard.Player')
    .filter('secondsToDateTime', [function () {
        return function (seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };
    }]);
'use strict';

//LadderSvc service used to communicate Ladder REST endpoints
angular.module('Leaderboard.Player')

    .factory('LadderPlayerSvc', ['$http', '$q',
        function ($http, $q) {
            return {
                getPlayer: function (game, player) {
                    var deferred = $q.defer(),
                        url = "http://api.cncnet.org:4007/ladder";

                    $http.jsonp(url + '/' + game + '/player/' + player + '?callback=JSON_CALLBACK')
                        .success(function (data) {
                            return deferred.resolve(data);
                        })
                        .error(function (data) {
                            deferred.reject(status);
                        });
                    return deferred.promise;
                }
            }
        }]
);
'use strict';

// Ladder controller
angular.module('Leaderboard').controller('LeaderboardController', ['$scope', '$state', '$stateParams', 'LadderSvc', 'PlayerSearch',
    function ($scope, $state, $stateParams, LadderSvc, PlayerSearch) {

        LadderSvc.getTop50($stateParams.game).then(function(response) {
            $scope.players = response;
        });

        // Search by player name
        $scope.searchByPlayer = function(){
            if($stateParams.game){
                PlayerSearch.byPlayer($stateParams.game, $scope.search.name).then(function (response) {
                    $scope.searchResults = response;
                });
            }
        };

        // Until we have game names in our response
        switch($stateParams.game) {
            case 'ts':
                $scope.abbr = 'ts';
                $scope.game = 'Tiberian Sun';
                break;
            case 'ra':
                $scope.abbr = 'ra';
                $scope.game = 'Red Alert';
                break;
            case 'yr':
                $scope.abbr = 'yr';
                $scope.game = 'Yuri\'s Revenge';
                break;
            case 'fs':
                $scope.abbr = 'fs';
                $scope.game = 'Firestorm';
                break;
            case 'am':
                $scope.abbr = 'am';
                $scope.game = 'Aftermath';
                break;
            case 'ra2':
                $scope.abbr = 'ra2';
                $scope.game = 'Red Alert 2';
                break;
            case 'dta':
                $scope.abbr = 'dta';
                $scope.game = 'The Dawn of the Tiberium Age';
                break;
            default:
                $scope.game = 'Global';
        }
    }
]);


'use strict';

//LadderSvc service used to communicate Ladder REST endpoints
angular.module('Leaderboard')

    .factory('PlayerSearch', ['$http', '$q',
        function ($http, $q) {
            return {
                byPlayer: function (game, name) {
                    var deferred = $q.defer(),
                    url = "http://tahj.cncnet.org:4007/ladder";
                    $http.post(url + '/' + game + '/' + 'search', { "player": name})
                        .success(function (data, status, headers, config) {
                            return deferred.resolve(data);
                        }).error(function (data, status, headers, config) {
                            console.log(status);
                        });
                    return deferred.promise;
                }
            }
        }]
);
'use strict';

//LadderSvc service used to communicate Ladder REST endpoints
angular.module('Leaderboard')

    .factory('LadderSvc', ['$http', '$q',
        function ($http, $q) {
            return {
                getTop50: function (game) {
                    var deferred = $q.defer(),
                    url = "http://tahj.cncnet.org:4007/ladder";

                    $http.jsonp(url + '/' + game + '?callback=JSON_CALLBACK')
                        .success(function (data) {
                            return deferred.resolve(data);
                        })
                        .error(function (data) {
                            deferred.reject(status);
                        });
                    return deferred.promise;
                }
            }
        }]
);