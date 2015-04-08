app.controller('CategoryController', function($scope, $stateParams, FlashCardsFactory, $rootScope){

	$scope.flashCards = FlashCardsFactory.flashCards.filter(function(elem){
		return elem.category === $stateParams.category;
	});

	$rootScope.$broadcast('categoryFiltered');

});