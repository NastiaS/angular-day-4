app.controller('NewCardController', function (FlashCardsFactory, $scope, FlashCardsUpdate, $rootScope) {

    $scope.newCard = {
        question: null,
        category: null,
        answers: [
            { text: null, correct: false },
            { text: null, correct: false },
            { text: null, correct: false }
        ]
    };

    $scope.submitting = false;

    $scope.submitCard = function (card) {

        $scope.submitting = true;

        FlashCardsFactory.addNewFlashCard(card).then(function (newCard) {

            //FlashCardsUpdate.flashCardsUpdated();

            $rootScope.$broadcast('flashCardsUpdated', newCard);

            $scope.submitting = false;

            $scope.newCard = {
                question: null,
                category: null,
                answers: [
                    { text: null, correct: false },
                    { text: null, correct: false },
                    { text: null, correct: false }
                ]
            };
        });

    };

});