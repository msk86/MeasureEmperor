(function (angular) {
    angular.module('metric').directive('metricCreateForm',
        [function () {
            function link($scope, element) {
                $scope.categories = [
                    {display: 'Normal', category: 'normal'},
                    {display: 'Schedule', category: 'schedule'}
                ];
                $scope.timeFrames = [
                    {display: 'Week', frame: 'week'},
                    {display: 'Fortnight', frame: 'fortnight'},
                    {display: 'Month', frame: 'month'},
                    {display: 'Year', frame: 'year'}
                ];
                $scope.processMethods = [
                    {display:'Total()', method:'total'},
                    {display:'Avg()', method:'avg'},
                    {display:'Max()', method:'max'},
                    {display:'Min()', method:'min'},
                    {display:'Last()', method:'last'}
                ];
                $scope.fortnightStartFrom = [
                    {display:'This week', startFrom:'thisweek'},
                    {display:'Last week', startFrom:'lastweek'}
                ];

                $scope.submit = function() {
                    var metricName = $scope.form.metricName;
                    $scope.create().then(function() {
                        $scope.cancelMethod();
                        alert('Metric ' + metricName + ' is ' + $scope.submitAction + 'd successfully!');
                    }, function(e) {
                        alert(e);
                    });
                };
            }

            return {
                link: link,
                scope: {
                    cancelMethod: '&',
                    submitAction: '@',
                    settings: '='
                },
                controller: 'MetricCreateController',
                restrict: 'E',
                templateUrl: '/templates/metric-create-form',
                replace: true
            };
        }]);
}(window.angular));
