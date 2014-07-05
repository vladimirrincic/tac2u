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

}])

.controller('CardDetailsController', ['$scope', '$routeParams', 'cardService', function($scope, $routeParams, cardService) {
        
        $scope.cardDetails = cardService.getCardById($routeParams.cardId);

        $scope.$watch('ngImage', function(newValue) {
            if(newValue) {
                $scope.cardDetails.image = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            console.log($scope.cardDetails);
        };
}]);