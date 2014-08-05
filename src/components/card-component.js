angular.module('services.card', ['ngResource', 'filters'])

.factory('cardService', [   'localStorageService', '$filter', function(localStorageService, $filter) {
        return {
            getCardById: function(cardId) {
                return $filter('getById')(localStorageService.get('cardList'), cardId).element;
            },
            getCardIndexById: function(cardId) {
                return $filter('getById')(localStorageService.get('cardList'), cardId).index;
            },
            saveCardLocal: function (cardObject, timestamp) {
                var tempCardListFromLocalStorage = localStorageService.get('cardList');
                
                if (cardObject.id === '' || cardObject.id === null || cardObject.id === undefined) {
                    tempCardListFromLocalStorage.push(cardObject);
                } else {
                    var cardIndex = this.getCardIndexById(cardObject.id);
                    tempCardListFromLocalStorage[cardIndex] = cardObject;
                }
                localStorageService.set('cardList', tempCardListFromLocalStorage);
                localStorageService.set('timestamp', timestamp);
            },
            deleteCardLocal: function (cardId, timestamp) {
                var tempCardListFromLocalStorage = localStorageService.get('cardList'),
                    cardIndex = this.getCardIndexById(cardId);
                
                if(cardIndex !== null) {
                    tempCardListFromLocalStorage.splice(cardIndex, 1);
                }
                localStorageService.set('cardList', tempCardListFromLocalStorage);
                localStorageService.set('timestamp', timestamp);
            },
            vCardGenerator: function (cardId) {
                var vCard, vCardEncoded, cardDetails = this.getCardById(cardId);
                
                vCard = "BEGIN:VCARD\n";
                
                if (cardDetails.fullName) {
                    vCard += ("N:" + cardDetails.fullName + "\n");
                    vCard += ("FN:" + cardDetails.fullName + "\n");
                }
                if (cardDetails.phone) {
                    vCard += ("TEL:" + cardDetails.mobile + "\n");
                }
                if (cardDetails.email) {
                    vCard += ("EMAIL;WORK:" + cardDetails.email + "\n");
                }
                if (cardDetails.address1) {
                    vCard += ("ADR;HOME:;;" + cardDetails.address + ";;");
                }
                if (cardDetails.address2) {
                    vCard += cardDetails.skype;
                } else {
                    vCard += (";;\n");
                }
                
                vCard += "END:VCARD";
                
                vCardEncoded = encodeURIComponent(vCard);
                
                return vCard;

            }
        };
}])

.factory('cardServiceCreate', ['$resource', 'localStorageService', 'userService', '$filter', 'options', function($resource, localStorageService, userService, $filter, options) {
        return $resource(options.baseUrl + '/bcard/a/:userId/create', {
            userId: userService && userService.userDetails().id
        },
        {
            create: {method: 'POST'}
        });
}])

.factory('cardServiceGetAll', ['$resource', 'localStorageService', 'userService', '$filter', 'options', function($resource, localStorageService, userService, $filter, options) {
        return $resource(options.baseUrl + '/bcard/a/user/:userId', {
            userId: userService && userService.userDetails().id
        },
        {
            getAll: {method: 'GET', isArray: true}
        });
}])

.factory('cardDeleteService', ['$resource', 'options', function($resource, options) {
        return $resource(options.baseUrl + '/bcard/a/delete/:id', {
            
        },
        {
            deleteCard: {method: 'DELETE'}
        });
}])

.factory('timestampService', ['$resource', 'userService', 'options', function($resource, userService, options) {
        return $resource(options.baseUrl + '/bcard/a/timestamps/:userId', {
            userId: userService && userService.userDetails().id
        },
        {
            getTimestamp: {method: 'GET', isArray: true}
        });
}]);