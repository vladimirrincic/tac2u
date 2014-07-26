angular.module('services.card', ['ngResource', 'filters'])

.factory('cardService', ['$resource', 'localStorageService', '$filter', 'options', function($resource, localStorageService, $filter, options) {
        return {
            getAllCards: function() {
                // return $resource(options.baseUrl + '/cards', {});
                return $resource('json/cards.json', {});
            },
            getCardById: function(cardId) {
                return $filter('getById')(localStorageService.get('cardList'), cardId).element;
            },
            vCardGenerator: function (cardId) {
                var vCard, vCardEncoded, cardDetails = this.getCardById(cardId);
                
                vCard = "BEGIN:VCARD\n";
                
                if (cardDetails.fullName) {
                    vCard += ("FN:" + cardDetails.fullName + "\n");
                }
                if (cardDetails.phone) {
                    vCard += ("TEL;WORK:" + cardDetails.phone + "\n");
                }
                if (cardDetails.email) {
                    vCard += ("EMAIL;WORK:" + cardDetails.email + "\n");
                }
                if (cardDetails.address1) {
                    vCard += ("ADR;HOME:;;" + cardDetails.address1 + ";;");
                }
                if (cardDetails.address2) {
                    vCard += cardDetails.address2;
                } else {
                    vCard += (";;\n");
                }
                
                vCard += "END:VCARD";
                
                vCardEncoded = encodeURIComponent(vCard);
                
                return vCard;

            }
        };
}]);