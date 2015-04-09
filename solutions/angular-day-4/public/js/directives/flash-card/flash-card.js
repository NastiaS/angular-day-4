app.directive('flashCard', function (ScoreFactory) {

    return {
        restrict: 'E',
        templateUrl: 'js/directives/flash-card/flash-card.html',
        scope: {
            card: '='
        }

    }

});
