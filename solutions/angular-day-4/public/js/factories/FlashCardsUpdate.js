app.factory('FlashCardsUpdate', function () {

    var listeners = [];

    return {
        flashCardsUpdated: function () {
            listeners.forEach(function (fn) {
                fn();
            });
        },
        onUpdate: function (fn) {
            listeners.push(fn);
        }
    };

});