app.controller('MainController', function ($scope, FlashCardsFactory) {
    

    $scope.cardsLoading = true;

    $scope.categories = FlashCardsFactory.categories;

    $scope.chosenCategory = 'All';

    $scope.getAllCards = function () {
        $scope.chosenCategory = 'All';
        $scope.cardsLoading = true;
        
        FlashCardsFactory.getFlashCards().then(function (cards) {
            $scope.cardsLoading = false;
            FlashCardsFactory.flashCards = cards;
            $scope.flashCards = FlashCardsFactory.flashCards;
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