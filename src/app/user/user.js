angular.module('user', ['services.user'])

.controller('UserLoginController', ['$scope', '$location', '$window', 'userService', 'authenticationService', 'messageService', 'options', '$rootScope', 'localStorageService',
    function($scope, $location, $window, userService, authenticationService, messageService, options, $rootScope, localStorageService) {
        $scope.signIn = function(username, password) {
            userService.signIn(username, password).success(function(response) {
                authenticationService.isLogged = true;
                $window.localStorage.token = response.token;
                $window.localStorage.setItem('user', JSON.stringify(response.user));
                $rootScope.mainMenu[0].name = userService.userDetails().fullName;
                if (localStorageService.get('cardList') === null) {
                    localStorageService.set('cardList', []);
                };
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
            var ref = window.open('https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=uhdc30va3ilh&state=' + new Date().getTime() + '&scope=r_basicprofile%20r_fullprofile%20r_emailaddress%20r_contactinfo&redirect_uri=' + options.baseUrl + '/user/e/oauth', '_system', 'location=yes');
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