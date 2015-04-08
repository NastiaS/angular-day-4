app.directive('error', function () {

    return {
        restrict: 'E',
        transclude: true,
        template: '<span style="color:red;" ng-transclude></span>'
    }

});