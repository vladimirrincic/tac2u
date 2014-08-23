/**
 * Declare main app module with all necessary dependecies and
 * application routing
 */

angular.module('app', ['ngRoute', 'ngAnimate', 'ngTouch', 'LocalStorageModule', 'services.constants', 'user', 'card', 'home', 'services.message', 'monospaced.qrcode', 'templates.app', 'directives'])

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
                .when('/forgot-password', {
                    templateUrl: 'user/user-forgot-password.tpl.html',
                    controller: 'UserForgotPassword',
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
                    resolve:{
                        resolvedCardList: function (loadCardListService) {
                            return loadCardListService();
                        }
                    },
                    access: {
                        requireLogin: true
                    }
                })
                .when('/cards/:id', {
                    templateUrl: 'card/card-details.tpl.html',
                    controller: 'CardDetailsController',
                    resolve: {
                        resolvedCardObject: function(cardService, $route) {
                            return cardService.getCardDetailsForView($route.current.params.id);
                        },
                        resolvedQR: function(cardService, $route) {
                            return cardService.vCardGenerator($route.current.params.id);
                        }
                    },
                    access: {
                        requireLogin: true
                    }
                })
                .when('/edit/:id', {
                    templateUrl: 'card/card-edit.tpl.html',
                    controller: 'CardEditController',
                    resolve: {
                        resolveCardObject: function(cardService, $route) {
                            return cardService.getCardDetailsForView($route.current.params.id);
                        }
                    },
                    access: {
                        requireLogin: true
                    }
                })
                .when('/card-templates', {
                    templateUrl: 'card/card-templates.tpl.html',
                    controller: 'CardTemplatesController',
                    access: {
                        requireLogin: true
                    }
                })
                .when('/add/:layoutId', {
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

.run(['$rootScope', '$location', 'authenticationService', 'userService', 'messageService', 'options', '$timeout',
    function($rootScope, $location, authenticationService, userService, messageService, options, $timeout) {
        $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
            
            // Check if user is logged in and redirect
            if(authenticationService.isLogged && nextRoute.originalPath === "/login") {
                $location.path('/home');
                $rootScope.mainMenu[0].name = userService.userDetails().fullName;
            } else if (!authenticationService.isLogged && nextRoute.originalPath === "/login") {
                $rootScope.isLoginView = true;
            }
            if (nextRoute.originalPath !== "/login") {
                $rootScope.isLoginView = false;
            }
            
            // Check whether to clear action message or to keep it
            if ($rootScope.actionMessage && !$rootScope.actionMessage.keepMessage) {
                messageService.clearMessages();
            } else if ($rootScope.actionMessage) {
                $rootScope.actionMessage.keepMessage = false;
            }
            
            $rootScope.animatedDivActive = false;
        });
        
        $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.showmenu = false;
            $timeout(function() {
                $rootScope.animatedDivActive = true;
            }, 1);
            
        });
}])

.controller('AppController', ['$scope', '$rootScope', '$window', '$location', 'authenticationService', 'userService', 'options', 'localStorageService', 'messageService',
    function($scope, $rootScope, $window, $location, authenticationService, userService, options, localStorageService, messageService) {
        
        // Hack for screen resolution
        var meta = document.createElement("meta");
        meta.setAttribute('name','viewport');
        meta.setAttribute('content','initial-scale=1.5,height=device-height,user-scalable=no, width=device-width,maximum-scale='+ (1/window.devicePixelRatio) + ',minimum-scale='+ (1/window.devicePixelRatio));
        document.getElementsByTagName('head')[0].appendChild(meta);
        
        $scope.appInfo = {
            name: options.name
        };
        
        $rootScope.mainMenu = [
            {
                url: '#/home',
                name: '',
                class: 'menu-item-user'
            },
            {
                url: '#/card-templates',
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
            delete $window.localStorage.token;
            delete $window.localStorage.linkedinToken;
            $location.path('/');
            $scope.toggleMenu();
        };

        $rootScope.showmenu = false;
        $scope.toggleMenu = function() {
            $rootScope.showmenu = ($rootScope.showmenu) ? false : true;
        };
        
        $scope.liAccessToken = null;
        
        $scope.$watch('liAccessToken', function(newValue, oldValue) {
            if (newValue !== null) {
                var linkedinUserObject;
                userService.linkedinSignup(newValue).then(function(response) {
                    linkedinUserObject = {
                        fullName: response.data.firstName + ' ' + response.data.lastName,
                        email: response.data.emailAddress,
                        password: newValue
                    };
                    return userService.userExists(linkedinUserObject.email);
                }).then(function (user) {
                    linkedinUserObject['id'] = user.data.id;
                    return userService.signUp(linkedinUserObject);
                }, function () {
                    return userService.signUp(linkedinUserObject);
                }).then(function (response) {
                    return userService.signIn(response.data.email, newValue);
                }).then(function (response) {
                    authenticationService.isLogged = true;
                    $window.localStorage.token = response.data.token;
                    $window.localStorage.linkedinToken = newValue;
                    $window.localStorage.setItem('user', JSON.stringify(response.data.user));
                    $rootScope.mainMenu[0].name = userService.userDetails().fullName;
                    if (localStorageService.get('cardList') === null) {
                        localStorageService.set('cardList', []);
                    }
                    $location.path("/home");
                }, function () {
                    messageService.addActionMessage('error', options.DEFAULT_ERROR);
                });


            }
        });
             
}]);