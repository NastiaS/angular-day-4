app.controller('NewCardController', function($scope, FlashCardsFactory){

	$scope.categories = FlashCardsFactory.categories;

	$scope.emptyCard = function(){
		$scope.newCard = {
		    question: null,
		    category: null,
		    answers: [
		        { text: null, correct: false },
		        { text: null, correct: false },
		        { text: null, correct: false }
		    ]
		};
	}

	$scope.emptyCard();

	$scope.submitNewCard = function(card){
		
		FlashCardsFactory.makeNewCard(card).then(function(newCard){
			$scope.emptyCard();
			FlashCardsFactory.flashCards.push(newCard);
		});


		// .then(function(){
		// 	return FlashCardsFactory.getFlashCards();
		// }).then(function(cards){
		// 	FlashCardsFactory.flashCards = cards;
		// })
	};

});