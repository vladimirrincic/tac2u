angular.module('services.user', [])

.factory('userService', ['$http', '$window', 'options', function($http, $window, options) {
    return {
        userDetails: function() {
            return JSON.parse($window.localStorage.getItem('user'));  
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
        },
        linkedinSignup: function (accessToken) {
            return $http({
                method: 'GET',
                url: 'https://api.linkedin.com/v1/people/~:(first-name,last-name,email-address)?format=json&oauth2_access_token=' + accessToken
            });
        },
        userExists: function (email) {
            return $http({
                method: 'GET',
                url: options.baseUrl + '/user/e/email?email=' + email
            });
        },
        isLinkedinUser: function () {
            return $window.localStorage.linkedinToken !== undefined ? true : false;
        },
        getLinkedinUserDetails: function () {
            return $http({
                method: 'GET',
                url: 'https://api.linkedin.com/v1/people/~:(first-name,last-name,headline,email-address,phone-numbers,main-address)?format=json&oauth2_access_token=' + $window.localStorage.linkedinToken
            });
        }
    };
}])

.factory('authenticationService', ['$window', function($window) {
        return {
            isLogged: $window.localStorage.token !== undefined ? true : false
        };
}])

.factory('tokenInterceptor', ['$rootScope', '$q', '$window', '$location', 'messageService', 'authenticationService', 'options', 
    function ($rootScope, $q, $window, $location, messageService, authenticationService, options) {
    return {
        request: function (config) {
            config.headers = config.headers || {};

            if ($window.localStorage.token) {
                config.headers['X-Auth-Token'] = $window.localStorage.token;
            }
            return config;
        },
        

 
//        response: function (response) {
//            if (response.status === 401) {
//                authenticationService.isLogged = false;
//                delete $window.localStorage.token;
//                $location.path('/login');
//                messageService.addActionMessage('error', options.PLEASE_LOGIN, true);
//            }
//            return response || $q.when(response);
//        },
        
        responseError: function(rejection) {
            if (rejection.status === 401) {
                authenticationService.isLogged = false;
                delete $window.localStorage.token;
                $location.path('/login');
                messageService.addActionMessage('error', options.PLEASE_LOGIN, true);
            }
            return $q.reject(rejection);
        }
    };
}]);