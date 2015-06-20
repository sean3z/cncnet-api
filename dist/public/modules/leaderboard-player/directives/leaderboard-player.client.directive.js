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