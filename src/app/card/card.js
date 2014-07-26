angular.module('card', ['services.card', 'directives'])

.controller('CardListController', ['$scope', 'cardService', 'localStorageService', function($scope, cardService, localStorageService) {
        var timestampOk = false;

        if (!timestampOk) {
            cardService.getAllCards().query().$promise.then(function(response) {
                    localStorageService.clearAll();
                    localStorageService.set('cardList', response);
            });
        }

        $scope.cardList = localStorageService.get('cardList');
        
        $scope.cardListEmpty = false;
        if ($scope.cardList.length === 0) {
            $scope.cardListEmpty = true;
        }

}])

.controller('CardDetailsController', ['$scope', '$routeParams', '$window', 'cardService', 'options', function($scope, $routeParams, $window, cardService, options) {
        var qrCodeSize = options.qrCodeSize, windowWidth = $window.innerWidth;
        
        if (windowWidth > 720) {
            qrCodeSize *= 3;
        } else if (windowWidth > 540) {
            qrCodeSize *= 2;
        } else if (windowWidth > 360) {
            qrCodeSize *= 1.5;
        }
        
        $scope.cardDetails = cardService.getCardById($routeParams.cardId);
        $scope.vCard = {
            string: cardService.vCardGenerator($routeParams.cardId),
            size: qrCodeSize,
            version: options.qrCodeVersion,
            errorCorrection: options.errorCorrection
        };

}])

.controller('CardEditController', ['$scope', '$routeParams', 'cardService', function($scope, $routeParams, cardService) {
        
        $scope.cardDetails = cardService.getCardById($routeParams.cardId);

        $scope.$watch('ngImage', function(newValue) {
            if(newValue) {
                $scope.cardDetails.logo = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            console.log($scope.cardDetails);
        };
}])

.controller('CardTemplatesController', ['$scope', function($scope) {
        $scope.cardLayoutList = [
            {
                layoutId: 1
            },
            {
                layoutId: 2
            },
            {
                layoutId: 3
            },
            {
                layoutId: 4
            }
        ];
}])

.controller('CardAddController', ['$scope', '$routeParams', 'cardService', function($scope, $routeParams, cardService) {
        
        $scope.cardDetails = {
            layoutId: $routeParams.layoutId
        };

        $scope.$watch('ngImage', function(newValue) {
            if (newValue) {
                $scope.cardDetails.logo = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            console.log($scope.cardDetails);
        };
}]);