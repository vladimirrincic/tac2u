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

.controller('CardDetailsController', ['$scope', '$routeParams', 'cardService', function($scope, $routeParams, cardService) {
        
        $scope.cardDetails = cardService.getCardById($routeParams.cardId);

}])

.controller('CardEditController', ['$scope', '$routeParams', 'cardService', function($scope, $routeParams, cardService) {
        
        $scope.cardDetails = cardService.getCardById($routeParams.cardId);

        $scope.$watch('ngImage', function(newValue) {
            if(newValue) {
                $scope.cardDetails.image = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            console.log($scope.cardDetails);
        };
}])

.controller('CardAddController', ['$scope', 'cardService', function($scope, cardService) {
        
        $scope.cardDetails = {};

        $scope.$watch('ngImage', function(newValue) {
            if(newValue) {
                $scope.cardDetails.image = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            console.log($scope.cardDetails);
        };
}]);