(function (angular) {
    angular.module('metric').directive('metricRecordForm',
        [function () {
            function link($scope) {
                $scope.$watchCollection('metric', function() {
                    console.log($scope.metric);
                });

                $scope.submit = function() {
                    $scope.record().then(function() {
                        alert('Record successfully!');
                    });
                }
            }
            return {
                link: link,
                scope: true,
                controller: 'MetricRecordController',
                restrict: 'E',
                templateUrl: '/templates/metric-record-form',
                replace: true
            };
        }]);
}(window.angular));
