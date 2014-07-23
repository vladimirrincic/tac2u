/**
 * Declare main app module with all necessary dependecies and
 * application routing
 */

angular.module('app', ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'services.constants', 'user', 'card', 'home', 'services.message', 'templates.app'])

.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $routeProvider
                .when('/login', {
                    templateUrl: 'user/user-login.tpl.html',
                    controller: 'UserLoginController',
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
                .when('/home', {
                    templateUrl: 'home/home.tpl.html',
                    controller: 'homeController',
                    access: {
                        requireLogin: true
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
                .when('/edit/:cardId', {
                    templateUrl: 'card/card-edit.tpl.html',
                    controller: 'CardEditController',
                    access: {
                        requireLogin: true
                    }
                })
                .when('/add', {
                    templateUrl: 'card/card-edit.tpl.html',
                    controller: 'CardAddController',
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
                $location.path('/home');
            }
        });
}])

.controller('AppController', ['$scope','$window', '$location', 'authenticationService', 'options', function($scope, $window, $location, authenticationService, options) {
        
        $scope.appInfo = {
            name: options.name
        };
        
        $scope.mainMenu = [
            {
                url: '#/home',
                name: 'Vladimir Rincic',
                class: 'menu-item-user'
            },
            {
                url: '#/create',
                name: 'Create Business Card',
                class: 'menu-item-edit'
            },
            {
                url: '#/cards',
                name: 'My Business Cards',
                class: 'menu-item-mycard'
            },
            {
                url: '#/online',
                name: 'Online mode',
                class: 'menu-item-online'
            },
            {
                url: '#/about',
                name: 'About',
                class: 'menu-item-about'
            }
        ];
        
        $scope.logout = function() {
            authenticationService.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path('/');
        };
        
        $scope.mainMenuAnim = '';
        $scope.mainMenuToggle = function() {
            if ($scope.mainMenuAnim !== '') {
                $scope.mainMenuAnim = '';
            } else {
                $scope.mainMenuAnim = 'main-menu-visible';
            }
        };
        
}]);