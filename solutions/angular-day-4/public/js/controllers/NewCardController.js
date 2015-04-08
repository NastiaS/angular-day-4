app.controller('NewCardController', function (FlashCardsFactory, $scope, $rootScope) {

    $scope.reset = function(){
        $scope.newCard = {
            question: null,
            category: null,
            answers: [
                { text: null, correct: false },
                { text: null, correct: false },
                { text: null, correct: false }
            ]
        };
    };
    
    $scope.reset();

    $scope.submitting = false;

    $scope.submitCard = function (card) {

        $scope.submitting = true;

        FlashCardsFactory.addNewFlashCard(card).then(function (newCard) {

            $rootScope.$broadcast('flashCardsUpdated', newCard);

            $scope.submitting = false;

            $scope.reset();
        });

    };

});