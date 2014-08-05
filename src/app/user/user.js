angular.module('user', ['services.user'])

.controller('UserLoginController', ['$scope', '$location', '$window', 'userService', 'authenticationService', 'messageService', 'options', '$rootScope', 
    function($scope, $location, $window, userService, authenticationService, messageService, options, $rootScope) {
        $scope.signIn = function(username, password) {
            userService.signIn(username, password).success(function(response) {
                authenticationService.isLogged = true;
                $window.sessionStorage.token = response.token;
                $window.sessionStorage.setItem('user', JSON.stringify(response.user));
                $location.path("/home");
            }).error(function(data, status) {
                if (status !== 401) {
                    messageService.addActionMessage('error', options.DEFAULT_ERROR);
                } else {
                    messageService.addActionMessage('error', options.BAD_CREDENTIALS);
                }
            });
        };
        $scope.liConnect = function() {
            
        };
}])

.controller('UserSignUpController', ['$scope', '$location', 'userService', 'messageService', 'options', function($scope, $location, userService, messageService, options) {
        
    // Object with user signup details
    $scope.signupObject = {};

    // Sign up method
    $scope.signUp = function(signupObject) {
        userService.signUp(signupObject).success(function() {
            $location.path("/login");
            messageService.addActionMessage('success', options.SIGNUP_SUCCESS, true);
        }).error(function(data, status) {
            messageService.addActionMessage('error', options.DEFAULT_ERROR);
        });
    };
}])

.controller('UserForgotPassword', ['$scope', function($scope) {
        
}]);