angular.module('services.card', ['ngResource', 'filters'])

.factory('cardService', ['localStorageService', '$filter', '$q', 'options', function(localStorageService, $filter, $q, options) {
        return {
            getCardById: function(cardId) {
                return $filter('getById')(localStorageService.get('cardList'), cardId).element;
            },
            getCardIndexById: function(cardId) {
                var cardObject = $filter('getById')(localStorageService.get('cardList'), cardId);
                
                if (cardObject !== null) {
                    return cardObject.index;
                } else {
                    return false;
                }
            },
            saveCardLocal: function (cardObject, serverResponse) {
                var cardIndex,
                        tempCardListFromLocalStorage = localStorageService.get('cardList');
                
                if (serverResponse.timestamp) {
                    cardObject['timestamp'] = serverResponse.timestamp;
                }
                
                if (cardObject.id === undefined) {
                    cardObject['id'] = serverResponse.id;
                    delete cardObject['$promise'];
                    delete cardObject['$resolved'];
                    tempCardListFromLocalStorage.push(cardObject);
                } else {
                    cardIndex = this.getCardIndexById(cardObject.id);
                    if (cardIndex !== false) {
                        tempCardListFromLocalStorage[cardIndex] = cardObject;
                    } else {
                        tempCardListFromLocalStorage.push(cardObject);
                    }
                }
                
                localStorageService.set('cardList', tempCardListFromLocalStorage);
            },
            deleteCardLocal: function (cardId) {
                var tempCardListFromLocalStorage = localStorageService.get('cardList'),
                    cardIndex = this.getCardIndexById(cardId);
                
                if(cardIndex !== null) {
                    tempCardListFromLocalStorage.splice(cardIndex, 1);
                }
                localStorageService.set('cardList', tempCardListFromLocalStorage);
            },
            vCardGenerator: function(cardId) {
                var vCard, vCardEncoded, cardDetails;

                cardDetails = this.getCardDetailsForView(cardId);
                
                vCard = "BEGIN:VCARD\n";

                if (cardDetails.fullName) {
                    vCard += ("N:" + cardDetails.fullName + "\n");
                    vCard += ("FN:" + cardDetails.fullName + "\n");
                }
                if (cardDetails.phone) {
                    vCard += ("TEL:" + cardDetails.phone + "\n");
                }
                if (cardDetails.email) {
                    vCard += ("EMAIL;WORK:" + cardDetails.email + "\n");
                }
                if (cardDetails.address1) {
                    vCard += ("ADR;HOME:;;" + cardDetails.addressLine1 + ";;");
                }
                if (cardDetails.address2) {
                    vCard += cardDetails.addressLine2;
                } else {
                    vCard += (";;\n");
                }

                vCard += "END:VCARD";

                vCardEncoded = encodeURIComponent(vCard);

                return vCard;

            },
            cardDetailForSave: function (cardObject) {
                var address = '';
                
                if (cardObject.addressLine1 !== '' && cardObject.addressLine1 !== null && cardObject.addressLine1 !== undefined) {
                    address += cardObject.addressLine1;
                }
                if (cardObject.addressLine2 !== '' && cardObject.addressLine2 !== null && cardObject.addressLine1 !== undefined) {
                    address += '{SPLIT}' + cardObject.addressLine2;
                }
                
                delete cardObject['addressLine1'];
                delete cardObject['addressLine2'];
                delete cardObject['logoUrl'];
                
                cardObject['address'] = address;
                
                return cardObject;
            },
            getCardDetailsForView: function (cardId) {
                var addressArray, cardDetails = this.getCardById(cardId);
                
                if (cardDetails.address) {
                    addressArray = cardDetails.address.split('{SPLIT}');
                    cardDetails['addressLine1'] = addressArray[0];
                    if (addressArray[1] !== '' && addressArray[1] !== 'undefined') {
                        cardDetails['addressLine2'] = addressArray[1];
                    }
                    delete cardDetails['address'];
                }
                
                if (cardDetails.logo !== null) {
                    cardDetails['logoUrl'] = options.baseUrl + '/logo/logo-' + cardId + '.' + cardDetails.logoType;
                } else {
                    cardDetails['logoUrl'] = null;
                }
                
                return cardDetails;
            }
        };
}])

.factory('loadCardListService', ['$resource', '$q', 'userService', 'timestampService', 'cardService', 'localStorageService', 'options', 
    function($resource, $q, userService, timestampService, cardService, localStorageService, options) {
        return function () {
            var i, j, k, z, localTimestamp, serverTimestamp, isTimestampExists,
                    deferred = $q.defer(),
                    localTimestamps = timestampService.getLocalTimestamps(), 
                    timestampsListToGet = [],
                    timestampsObjectsToDeleteList = localTimestamps;
            
            $resource(options.baseUrl + '/bcard/a/timestamps/:userId', { userId: userService && userService.userDetails().id }, { getTimestamp: { method: 'GET', isArray: true } }).getTimestamp().$promise
            .then(function (serverTimestamps) {
                for (i = 0; i < serverTimestamps.length; i++) {
                    serverTimestamp = serverTimestamps[i];
                    isTimestampExists = false;
                    for (j = 0; j < localTimestamps.length; j++) {
                        localTimestamp = localTimestamps[j];
                        if (serverTimestamp.id === localTimestamp.id) {
                            isTimestampExists = true;
                            if (serverTimestamp.timestamp !== localTimestamp.timestamp) {
                                timestampsListToGet.push(localTimestamp.id.toString());
                            }
                            timestampsObjectsToDeleteList.splice(j, 1);
                        }
                    }
                    if (!isTimestampExists) {
                        timestampsListToGet.push(serverTimestamps[i].id.toString());
                    }
                }
                for (k = 0; k < timestampsObjectsToDeleteList.length; k++) {
                    cardService.deleteCardLocal(timestampsObjectsToDeleteList[k].id);
                }
                
                if (timestampsListToGet.length > 0) {
                    var t,
                        listDeferred = $q.defer(),
                        promisesList = [];
                    
                    for (t = 0; t < timestampsListToGet.length; t++) {
                            promisesList.push($resource(options.baseUrl + '/bcard/a/:cardId', { cardId: timestampsListToGet[t] }, { getCard: { method: 'GET' } }).getCard().$promise);
                    }
                    
                    $q.all(promisesList).then(function (done) {
                        listDeferred.resolve(done);
                    });

                    return listDeferred.promise;
                    
                } 
                
            }).then(function (cardList) {
                if (cardList) {
                    for (z = 0; z < cardList.length; z++) {
                        var serverResponce = {
                            id: cardList[z].id,
                            timestamp: cardList[z].timestamp
                        };
                        
                        cardService.saveCardLocal(cardList[z], serverResponce);
                    }
                }
                deferred.resolve(localStorageService.get('cardList'));
            });
            
            return deferred.promise;
        };

}])

.factory('cardServiceCreate', ['$resource', 'userService', 'options', function($resource, userService, options) {
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

.factory('timestampService', ['localStorageService', function(localStorageService) {
        return {
            getLocalTimestamps: function() {
                var i, timestampsList = [], cardList = localStorageService.get('cardList');
                
                for (i = 0; i < cardList.length; i++) {
                    timestampsList.push({
                        id: cardList[i].id,
                        timestamp: cardList[i].timestamp
                    });
                }

                return timestampsList;
            }
        };
}]);