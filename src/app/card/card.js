angular.module('card', ['services.card', 'directives'])

.controller('CardListController', ['$scope', 'localStorageService', 'cardServiceGetAll', 'cardDeleteService', 'cardService', 'timestampObject', 'messageService', 'options', '$route',
    function($scope, localStorageService, cardServiceGetAll, cardDeleteService, cardService, timestampObject, messageService, options, $route) {
        var serverTimestamp = timestampObject[0] && timestampObject[0].timestamp,
            localTimestamp = localStorageService.get('timestamp');

        if (localTimestamp !== serverTimestamp || localTimestamp === serverTimestamp) {
            cardServiceGetAll.getAll().$promise.then(function(response) {
                localStorageService.clearAll();
                localStorageService.set('cardList', response);
                $scope.cardList = response;
                $scope.cardListEmpty = false;
                if ($scope.cardList.length === 0) {
                    $scope.cardListEmpty = true;
                }
            });
        } else {
            $scope.cardList = localStorageService.get('cardList');
            $scope.cardListEmpty = false;
            if ($scope.cardList.length === 0) {
                $scope.cardListEmpty = true;
            } 
        }
        
        $scope.deleteCard = function (cardId) {
            cardDeleteService.deleteCard({ id:cardId }).$promise.then(function(response) {
                cardService.deleteCardLocal(cardId, response.timestamp);
                messageService.addActionMessage('success', options.CARD_DELETED, true);
                $route.reload(); 
            }, function() {
                messageService.addActionMessage('error', options.DEFAULT_ERROR);
            });
        };
}])

.controller('CardDetailsController', ['$scope', '$routeParams', '$window', 'cardService', 'options', function($scope, $routeParams, $window, cardService, options) {
        var qrCodeSize = options.qrCodeSize, windowWidth = $window.innerWidth;
        
        if (windowWidth > 720) {
            qrCodeSize *= 3; // xxhdpi
        } else if (windowWidth > 640) {
            qrCodeSize *= 2; // xhdpi
        } else if (windowWidth > 540) {
            qrCodeSize *= 1.65; // Retina
        } else if (windowWidth > 360) {
            qrCodeSize *= 1.5; // hdpi
        }
        
        $scope.cardDetails = cardService.getCardById($routeParams.id);
        $scope.vCard = {
            string: cardService.vCardGenerator($routeParams.id),
            size: qrCodeSize,
            version: options.qrCodeVersion,
            errorCorrection: options.errorCorrection
        };

}])

.controller('CardAddController', ['$scope', '$routeParams', '$location', 'cardService', 'cardServiceCreate', 'messageService', 'options', 
    function($scope, $routeParams, $location, cardService, cardServiceCreate, messageService, options) {
        
        $scope.cardDetails = {
            layoutId: $routeParams.layoutId
        };

        $scope.$watch('ngImage', function(newValue) {
            if (newValue) {
                $scope.cardDetails.logo = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            cardServiceCreate.create($scope.cardDetails).$promise.then(function(response) {
                cardService.saveCardLocal($scope.cardDetails, response.timestamp);
                messageService.addActionMessage('success', options.CARD_ADDED, true);
                $location.path("/cards");            
            });
        };
}])

.controller('CardEditController', ['$scope', '$routeParams', '$location', 'cardService', 'cardServiceCreate', 'messageService', 'options', 
    function($scope, $routeParams, $location, cardService, cardServiceCreate, messageService, options) {
        
        $scope.cardDetails = cardService.getCardById($routeParams.id);

        $scope.$watch('ngImage', function(newValue) {
            if(newValue) {
                $scope.cardDetails.logo = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            cardServiceCreate.create($scope.cardDetails).$promise.then(function(response) {
                cardService.saveCardLocal($scope.cardDetails, response.timestamp);
                messageService.addActionMessage('success', options.CARD_EDITED, true);
                $location.path("/cards/" + $routeParams.id);
            });
        };
}])

.controller('CardTemplatesController', ['$scope', function($scope) {
        $scope.cardLayoutList = [
            {
                layoutId: 1,
                fullName: 'Jonh Smith',
                occupation: 'General Manager',
                mobile: '123 456 7890',
                email: 'email@email.com',
                webpage: 'www.webpage.com',
                address: '1234 Main Street Anytown ',
                skype: 'USA, 123456',
                logo: 'img/example_logo.png'
            },
            {
                layoutId: 2,
                fullName: 'Jonh Smith',
                occupation: 'General Manager',
                mobile: '123 456 7890',
                email: 'email@email.com',
                webpage: 'www.webpage.com',
                address: '1234 Main Street Anytown ',
                skype: 'USA, 123456',
                logo: 'img/example_logo.png'
            },
            {
                layoutId: 3,
                fullName: 'Jonh Smith',
                occupation: 'General Manager',
                mobile: '123 456 7890',
                email: 'email@email.com',
                webpage: 'www.webpage.com',
                address: '1234 Main Street Anytown ',
                skype: 'USA, 123456',
                logo: 'img/example_logo.png'
            },
            {
                layoutId: 4,
                fullName: 'Jonh Smith',
                occupation: 'General Manager',
                mobile: '123 456 7890',
                email: 'email@email.com',
                webpage: 'www.webpage.com',
                address: '1234 Main Street Anytown ',
                skype: 'USA, 123456',
                logo: 'img/example_logo.png'
            }
        ];
}]);