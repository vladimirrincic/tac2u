angular.module('services.user', [])

.factory('userService', ['$http', '$window', 'options', function($http, $window, options) {
    return {
        userDetails: function() {
            var userObject = {
                fullName: ''
            };
            userObject = JSON.parse($window.sessionStorage.getItem('user'));
            return userObject;  
        },
        signIn: function(username, password) {
            return $http({
                method: 'POST', 
                url: options.baseUrl + '/user/e/auth', 
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, 
                data: 'email=' + username + '&password=' + password
            });
        },
        signUp: function(signupObject) {
            return $http({
                method: 'POST', 
                url: options.baseUrl + '/user/e/create', 
                data: signupObject
            });
        }
    };
}])

.factory('authenticationService', ['$window', function($window) {
        return {
            isLogged: $window.sessionStorage.token !== undefined ? true : false
        };
}])

.factory('tokenInterceptor', ['$q', '$window', '$location', 'messageService', 'authenticationService', 'options', function ($q, $window, $location, messageService, authenticationService, options) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers['X-Auth-Token'] = $window.sessionStorage.token;
            }
            return config;
        },
 
//        response: function (response) {
//            if (response.status === 401) {
//                authenticationService.isLogged = false;
//                delete $window.sessionStorage.token;
//                $location.path('/login');
//                messageService.addActionMessage('error', options.PLEASE_LOGIN, true);
//            }
//            return response || $q.when(response);
//        },
        
        responseError: function(rejection) {
            if (rejection.status === 401) {
                authenticationService.isLogged = false;
                delete $window.sessionStorage.token;
                $location.path('/login');
                messageService.addActionMessage('error', options.PLEASE_LOGIN, true);
            }
            return $q.reject(rejection);
        }
    };
}]);