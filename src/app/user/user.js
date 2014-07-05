angular.module('user', ['services.user'])

.controller('UserController', ['$scope','$window', '$location', 'authenticationService', function($scope, $window, $location, authenticationService) {
        $scope.signOut = function() {
            authenticationService.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path('/');
        };
}])

.controller('UserSignInController', ['$scope', '$location', '$window', 'userService', 'authenticationService', function($scope, $location, $window, userService, authenticationService) {
        $scope.signIn = function(username, password) {
            userService.signIn(username, password).get().$promise.then(function(response) {
                authenticationService.isLogged = true;
                $window.sessionStorage.token = response.token;
                $location.path("/cards");
            }, function(status, data) {
                console.log(status);
                console.log(data);
            });
        };
}])

.controller('UserSignUpController', ['$scope', 'userService', function($scope, userService) {
        $scope.signUp = function(username, password) {
            userService.signUp(username, password).post().$promise.then(function(response) {
                console.log(response);
            }, function(status, data) {
                console.log(status);
                console.log(data);
            });
        };
}])

.controller('UserEditController', ['$scope', function($scope) {
        
}]);