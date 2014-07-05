/**
 * Declare main app module with all necessary dependecies and
 * application routing
 */

angular.module('app', ['ngRoute', 'LocalStorageModule', 'services.constants', 'user', 'card', 'services.message', 'templates.app'])

.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $routeProvider
                .when('/login', {
                    templateUrl: 'user/user-sign-in.tpl.html',
                    controller: 'UserSignInController',
                    access: {
                        requireLogin: false
                    }
                })
                .when('/signup', {
                    templateUrl: 'user/user-sign-up.tpl.html',
                    controller: 'UserSignUpController',
                    access: {
                        requireLogin: false
                    }
                })
                .when('/cards', {
                    templateUrl: 'card/card-list.tpl.html',
                    controller: 'CardListController',
                    access: {
                        requireLogin: true
                    }
                })
                .when('/cards/:cardId', {
                    templateUrl: 'card/card-details.tpl.html',
                    controller: 'CardDetailsController',
                    access: {
                        requireLogin: true
                    }
                })
                .otherwise({
                    redirectTo: '/login',
                    access: {
                        requireLogin: false
                    }
        });
        
        $httpProvider.interceptors.push('tokenInterceptor');
}])

.run(['$rootScope', '$location', 'authenticationService', 'messageService', 'options', function($rootScope, $location, authenticationService, messageService, options) {
        $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
            if (nextRoute.access.requireLogin && !authenticationService.isLogged) {
                $location.path('/');
                messageService.addMessage(options.loginNeededMessage);
            } else if(authenticationService.isLogged && nextRoute.originalPath === "/login") {
                $location.path('/cards');
            }
        });
}])

.controller('AppController', ['$scope', 'options', function($scope, options) {
        $scope.appInfo = {
            name: options.name
        };
}]);