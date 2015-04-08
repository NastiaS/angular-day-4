app.factory('FlashCardsFactory', function ($http) {

    return {
        getFlashCards: function () {
            return $http.get('/cards').then(function (response) {
                return response.data;
            });
        },
        getFlashCardsByCategory: function (category) {

            var configObj = {
                params: {
                    category: category
                }
            };

            return $http.get('/cards', configObj).then(function (response) {
                return response.data;
            });
        }
    };

});