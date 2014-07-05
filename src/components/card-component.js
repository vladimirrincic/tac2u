angular.module('services.card', ['ngResource', 'filters'])

.factory('cardService', ['$resource', 'localStorageService', '$filter', 'options', function($resource, localStorageService, $filter, options) {
        return {
            getAllCards: function() {
                // return $resource(options.baseUrl + '/cards', {});
                return $resource('json/cards.json', {});
            },
            getCardById: function(cardId) {
                return $filter('getById')(localStorageService.get('cardList'), cardId).element;
            }
        };
}]);