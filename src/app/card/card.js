angular.module('card', ['services.card'])

.controller('CardListController', ['$scope', 'cardDeleteService', 'cardService', 'messageService', 'options', '$route', 'resolvedCardList',
    function($scope, cardDeleteService, cardService, messageService, options, $route, resolvedCardList) {

        $scope.cardList = resolvedCardList;
        $scope.cardListEmpty = false;
        if ($scope.cardList.length === 0) {
            $scope.cardListEmpty = true;
        } 

        $scope.deleteCard = function (cardId) {
            cardDeleteService.deleteCard({ id:cardId }).$promise.then(function() {
                cardService.deleteCardLocal(cardId);
                messageService.addActionMessage('success', options.CARD_DELETED, true);
                $route.reload(); 
            }, function() {
                messageService.addActionMessage('error', options.DEFAULT_ERROR);
            });
        };
}])

.controller('CardDetailsController', ['$scope', '$window', 'options', 'resolvedCardObject', 'resolvedQR',
    function($scope, $window, options, resolvedCardObject, resolvedQR) {
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

        $scope.cardDetails = resolvedCardObject;
        
        $scope.vCard = {
            string: resolvedQR,
            size: qrCodeSize,
            version: options.qrCodeVersion,
            errorCorrection: options.errorCorrection
        };
        
        $scope.cardForShare = '';
        for (var prop in $scope.cardDetails) {
            if (
                    $scope.cardDetails[prop] !== '' 
                    && $scope.cardDetails[prop] !== null 
                    && prop !== 'id' 
                    && prop !== 'timestamp' 
                    && prop !== 'layoutId' 
                    && prop !== 'logo' 
                    && prop !== 'logoUrl'
                    && prop !== 'logoType'
                ) {
                $scope.cardForShare += options.cardLabels['label_' + prop] + ': ' + $scope.cardDetails[prop] + '\n';
            }
        }
        
        // THIS IS BAD, BUT CURRENTLY THIS IS THE ONLY WAY
        if ($scope.cardDetails.logoUrl) {
            document.getElementById('shareCard').onclick = function(){ window.plugins.socialsharing.share($scope.cardForShare, $scope.cardDetails.fullName, $scope.cardDetails.logoUrl, null); };
        } else {
            document.getElementById('shareCard').onclick = function(){ window.plugins.socialsharing.share($scope.cardForShare, $scope.cardDetails.fullName); };
        }
}])

.controller('CardAddController', ['$scope', '$routeParams', '$location', 'cardService', 'cardServiceCreate', 'messageService', 'options', 'userService',
    function($scope, $routeParams, $location, cardService, cardServiceCreate, messageService, options, userService) {
        
        var isLinkedinUser = userService.isLinkedinUser();
        
        $scope.cardLabels = {};
        for (var prop in options.cardLabels)  {
            $scope.cardLabels[prop] = options.cardLabels[prop];
        }
        
        $scope.cardDetails = {
            layoutId: $routeParams.layoutId
        };
        
        if (isLinkedinUser) {
            userService.getLinkedinUserDetails().then(function (response) {
                $scope.cardDetails.fullName = response.data.firstName + ' ' + response.data.lastName;
                if (response.data.emailAddress) $scope.cardDetails.email = response.data.emailAddress;
                if (response.data.mainAddress) $scope.cardDetails.addressLine1 = response.data.mainAddress;
                if (response.data.phoneNumbers.values[0].phoneNumber) $scope.cardDetails.phone = response.data.phoneNumbers.values[0].phoneNumber;
            });
        }

        $scope.$watch('ngImage', function(newValue) {
            if (newValue) {
                $scope.cardDetails.logoType = 'png';
                $scope.cardDetails.logo = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            var cardDetailForSave = cardService.cardDetailForSave($scope.cardDetails);
            
            cardServiceCreate.create(cardDetailForSave).$promise.then(function(response) {
                cardService.saveCardLocal(cardDetailForSave, response);
                messageService.addActionMessage('success', options.CARD_ADDED, true);
                $location.path("/cards");            
            });
        };
}])

.controller('CardEditController', ['$scope', '$routeParams', '$location', 'cardService', 'cardServiceCreate', 'messageService', 'options', 'resolveCardObject', 
    function($scope, $routeParams, $location, cardService, cardServiceCreate, messageService, options, resolveCardObject) {
        
        $scope.cardLabels = {};
        for (var prop in options.cardLabels)  {
            $scope.cardLabels[prop] = options.cardLabels[prop];
        }
        
        $scope.cardDetails = resolveCardObject;

        $scope.$watch('ngImage', function(newValue) {
            if(newValue) {
                $scope.cardDetails.logoType = 'png';
                $scope.cardDetails.logo = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            var cardDetailForSave = cardService.cardDetailForSave($scope.cardDetails);
            
            cardServiceCreate.create(cardDetailForSave).$promise.then(function(response) {
                cardService.saveCardLocal(cardDetailForSave, response);
                messageService.addActionMessage('success', options.CARD_ADDED, true);
                $location.path("/cards");            
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