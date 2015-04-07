app.controller('MainController', function ($scope, FlashCardsFactory) {

    $scope.flashCards = [];

    $scope.cardsLoading = true;

    $scope.categories = [
        'MongoDB',
        'Express',
        'Angular',
        'Node'
    ];

    $scope.chosenCategory = 'All';

    $scope.getAllCards = function () {
        $scope.chosenCategory = 'All';
        $scope.cardsLoading = true;
        FlashCardsFactory.getFlashCards().then(function (cards) {
            $scope.cardsLoading = false;
            $scope.flashCards = cards;
        });
    };

    $scope.getCategoryCards = function (category) {
        $scope.chosenCategory = category;
        $scope.cardsLoading = true;
        FlashCardsFactory.getFlashCards(category).then(function (cards) {
            $scope.cardsLoading = false;
            $scope.flashCards = cards;
        });
    };

    $scope.getAllCards();

});