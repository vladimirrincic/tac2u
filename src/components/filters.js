angular.module('filters', [])

.filter('getById', function() {
    return function(array, id) {
        var i, response = {};
        for (i = 0; i < array.length; i++) {
            if (array[i].cardId == id) {
                response.index = i;
                response.element = array[i];
                return response;
            }
        }
        return null;
    };
});