app.controller('MainController', function ($scope, FlashCardsFactory, FlashCardsUpdate, $rootScope, $state, $stateParams) {

    $rootScope.$on('categoryFiltered', function (event) {
        $scope.filtered = false;
    });

    //FlashCardsUpdate.onUpdate(function () {
    //    $scope.getAllCards();
    //});

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
        $scope.chosenCategory = category;
        // FlashCardsFactory.getFlashCards(category).then(function (cards) {
        //     $scope.cardsLoading = false;
        //     $scope.flashCards = cards;
        // });
    };

    $scope.getAllCards();

});