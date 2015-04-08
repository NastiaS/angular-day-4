app.controller('MainController', function ($scope, FlashCardsFactory, $rootScope, $state) {

    
    $scope.flashCards = [];
    $scope.cardsLoading = false;
    $scope.categories = [
        'MongoDB',
        'Express',
        'Angular',
        'Node'
    ];
    $scope.chosenCategory = 'All';
    $scope.filtered = true;


    $rootScope.$on('categoryFiltered', function (event) {
        $scope.filtered = false;
    });

    $scope.getAllCards = function () {
        $scope.chosenCategory = 'All';
        $scope.cardsLoading = true;

        FlashCardsFactory.getFlashCards().then(function (cards) {
            $scope.cardsLoading = false;
            $scope.flashCards = cards;
            FlashCardsFactory.flashCards = cards;
            $state.go('flashCards');
        });
    };

    $scope.getCategoryCards = function (category) {
        $state.go('flashCards.category', {category: category}); 
    };

    $scope.getAllCards();

});