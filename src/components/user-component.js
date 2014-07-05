angular.module('services.user', ['ngResource'])

.factory('userService', ['$resource', function($resource, options) {
    return {
        signIn: function(username, password) {
            // return $http.post(options.baseUrl + '/login', {username: username, password: password});
            return $resource('json/login.json', {});
        },
        signUp: function(username, password) {
            return $resource(options.baseUrl + '/signup', {username: username, password: password});
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
                config.headers.Authorization = $window.sessionStorage.token;
            }
            return config;
        },
 
        response: function (response) {
            if (response.status === 401) {
                authenticationService.isLogged = false;
                delete $window.sessionStorage.token;
                $location.path('/');
                messageService.addMessage(options.loginNeededMessage);
                // messageService.addMessage(response.errorMessageJsonFromBackend);
            }
            return response || $q.when(response);
        }
    };
}]);