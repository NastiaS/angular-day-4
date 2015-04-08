var app = angular.module('FlashCards', ['ui.router']);


app.config(function($stateProvider){
    
    $stateProvider.state('statistics', {
    url:'/statistics',
    templateUrl:'templates/stats.html',
    controller:"StatsController"
    });

    $stateProvider.state('addCard', {
    url:'/addCard',
    templateUrl:'templates/form.html',
    controller: "NewCardController"
    });


    $stateProvider.state('flashCards', {
    url:'/flashCards',
    templateUrl:'js/directives/flash-card/flash-card.html',
    controller: "MainController"
    });

    $stateProvider.state('flashCards.category', {
    url:'/:category',
    templateUrl:'templates/flashCardsByCategory.html',
    controller: 'CategoryController'
    });

});